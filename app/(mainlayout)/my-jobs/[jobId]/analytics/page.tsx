import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { BarChart3, Eye, MousePointerClick, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getJobAnalytics(jobId: string, userId: string) {
  const job = await prisma.jobPost.findFirst({
    where: {
      id: jobId,
      company: {
        userId: userId,
      },
    },
    select: {
      id: true,
      jobTitle: true,
      company: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          JobView: true,
          Application: true,
        },
      },
    },
  });

  if (!job) {
    return null;
  }

  const views = await prisma.jobView.findMany({
    where: {
      jobId: jobId,
    },
    select: {
      createdAt: true,
      userId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  const applications = await prisma.application.findMany({
    where: {
      jobId: jobId,
    },
    select: {
      createdAt: true,
      name: true,
      email: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 500, // Limit applications to prevent memory issues
  });

  // Calculate conversion rate
  const conversionRate =
    job._count.JobView > 0
      ? ((job._count.Application / job._count.JobView) * 100).toFixed(2)
      : "0.00";

  // Group views by date
  const viewsByDate = views.reduce((acc, view) => {
    const date = view.createdAt.toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    job,
    views,
    applications,
    conversionRate,
    viewsByDate,
  };
}

type Params = Promise<{ jobId: string }>;

export default async function JobAnalyticsPage({ params }: { params: Params }) {
  const user = await requireUser();
  const { jobId } = await params;
  const userId = user.id;
  if (!userId) return notFound();

  const analytics = await getJobAnalytics(jobId, userId);

  if (!analytics) {
    return notFound();
  }

  const { job, views, applications, conversionRate, viewsByDate } = analytics;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          {job.jobTitle} at {job.company.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{job._count.JobView}</div>
            <p className="text-xs text-muted-foreground">
              Unique page views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{job._count.Application}</div>
            <p className="text-xs text-muted-foreground">
              Total applications received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Views to applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(viewsByDate).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Days with views
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Views</CardTitle>
            <CardDescription>Last 20 views</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {views.slice(0, 20).map((view) => (
                  <TableRow key={`${view.createdAt.getTime()}-${view.userId || "anonymous"}`}>
                    <TableCell>
                      {view.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {view.createdAt.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {view.userId ? (
                        <span className="text-sm text-muted-foreground">Logged in</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Anonymous</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {views.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No views yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>All applications received</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.email}>
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>
                      {app.createdAt.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No applications yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
