import { auth } from "@/app/utils/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { logger } from "@/lib/logger";

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
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      try {
        // Use auth() directly instead of requireUser() to avoid redirects
        const session = await auth();

        // If you throw, the user will not be able to upload
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

        logger.debug("Image upload middleware passed", {
          userId: session.user.id,
        });

        // Whatever is returned here is accessible in onUploadComplete as `metadata`
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
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      try {
        // Use auth() directly instead of requireUser() to avoid redirects
        const session = await auth();

        // If you throw, the user will not be able to upload
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

        logger.debug("Resume upload middleware passed", {
          userId: session.user.id,
        });

        // Whatever is returned here is accessible in onUploadComplete as `metadata`
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
