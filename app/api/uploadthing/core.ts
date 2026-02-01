import { auth } from "@/app/utils/auth";
import { isAdmin } from "@/app/utils/isAdmin";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { logger } from "@/lib/logger";
import prisma from "@/app/utils/db";

const f = createUploadthing();
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute (company logo - company only)
    .middleware(async () => {
      try {
        const session = await auth();

        if (!session?.user?.id) {
          logger.error("Image upload attempted without user session", {
            hasSession: !!session,
            hasUser: !!session?.user,
            userId: session?.user?.id,
          });
          throw new UploadThingError(
            "Unauthorized - Please log in to upload files",
          );
        }

        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { userType: true, email: true },
        });
        const admin = user?.email ? isAdmin(user.email) : false;
        if (user?.userType === "JOB_SEEKER" && !admin) {
          throw new UploadThingError(
            "Image upload (e.g. company logo) is only available for company accounts.",
          );
        }

        logger.debug("Image upload middleware passed", {
          userId: session.user.id,
        });

        return { userId: session.user.id };
      } catch (error: any) {
        logger.error("Image upload middleware error", {
          error: error?.message || error,
          stack: error?.stack,
          errorType: error?.constructor?.name,
        });

        if (error instanceof UploadThingError) {
          throw error;
        }

        throw new UploadThingError(
          error?.message ||
            "Authentication failed. Please refresh the page and try again.",
        );
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      try {
        // Use file.url (newer UploadThing API) or fallback to file.ufsUrl
        const fileUrl = file.url || (file as any).ufsUrl;

        logger.info("Image upload complete", {
          userId: metadata.userId,
          fileUrl: fileUrl,
          fileName: file.name,
          fileSize: file.size,
        });

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
      } catch (error) {
        logger.error("Error in image onUploadComplete", error);
        throw error;
      }
    }),

  resumeUploader: f({
    "application/pdf": {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute (resume - job seeker only)
    .middleware(async () => {
      try {
        const session = await auth();

        if (!session?.user?.id) {
          logger.error("Resume upload attempted without user session", {
            hasSession: !!session,
            hasUser: !!session?.user,
            userId: session?.user?.id,
          });
          throw new UploadThingError(
            "Unauthorized - Please log in to upload files",
          );
        }

        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { userType: true, email: true },
        });
        const admin = user?.email ? isAdmin(user.email) : false;
        if (user?.userType === "COMPANY" && !admin) {
          throw new UploadThingError(
            "Resume upload is only available for job seeker accounts.",
          );
        }

        logger.debug("Resume upload middleware passed", {
          userId: session.user.id,
        });

        return { userId: session.user.id };
      } catch (error: any) {
        logger.error("Resume upload middleware error", {
          error: error?.message || error,
          stack: error?.stack,
          errorType: error?.constructor?.name,
        });

        if (error instanceof UploadThingError) {
          throw error;
        }

        throw new UploadThingError(
          error?.message ||
            "Authentication failed. Please refresh the page and try again.",
        );
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      try {
        // Use file.url (newer UploadThing API) or fallback to file.ufsUrl
        const fileUrl = file.url || (file as any).ufsUrl;

        logger.info("Resume upload complete", {
          userId: metadata.userId,
          fileUrl: fileUrl,
          fileName: file.name,
          fileSize: file.size,
        });

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
      } catch (error) {
        logger.error("Error in resume onUploadComplete", error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
