import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";

function createPdfBuffer(report: Awaited<ReturnType<typeof prisma.vendorReport.findUnique>>) {
  return new Promise<Buffer>((resolve, reject) => {
    const document = new PDFDocument({ size: "A4", margin: 48 });
    const chunks: Buffer[] = [];

    document.on("data", (chunk) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    document.rect(0, 0, document.page.width, 120).fillColor("#0b0b0b").fill();
    document.fillColor("#C9A227").fontSize(28).font("Helvetica-Bold").text("Hawthorne Systems", 48, 40);
    document.fillColor("#ffffff").fontSize(16).font("Helvetica").text("Vendor Report", 48, 76);

    document.moveDown(3);
    document.fillColor("#0b0b0b").fontSize(20).font("Helvetica-Bold").text(report?.propertyName ?? "Property report");
    document.moveDown(0.5);
    document.fontSize(11).font("Helvetica").fillColor("#4b5563").text(`Generated ${new Date(report?.createdAt ?? new Date()).toLocaleString("en-GB")}`);

    document.moveDown(1.5);
    document.fillColor("#0b0b0b").fontSize(14).font("Helvetica-Bold").text("Marketing Checklist");
    (report?.marketingChecklist as Array<{ label: string; done: boolean }> | undefined)?.forEach((item) => {
      document.fontSize(11).font("Helvetica").text(`${item.done ? "[x]" : "[ ]"} ${item.label}`);
    });

    document.moveDown(1);
    document.font("Helvetica-Bold").fontSize(14).text("Health Score");
    document.font("Helvetica").fontSize(11).text(`Score: ${((report?.healthScore as { score?: number })?.score ?? 0).toString()}/100`);
    const suggestions = (report?.healthScore as { suggestions?: string[] } | undefined)?.suggestions ?? [];
    suggestions.forEach((suggestion) => document.text(`- ${suggestion}`));

    document.moveDown(1);
    document.font("Helvetica-Bold").fontSize(14).text("Viewing Feedback");
    const feedbackSummary = report?.feedbackSummary as { averageRating?: number; latestFeedback?: Array<{ viewerName: string; comments: string }> } | undefined;
    document.font("Helvetica").fontSize(11).text(`Average rating: ${(feedbackSummary?.averageRating ?? 0).toFixed(1)}`);
    feedbackSummary?.latestFeedback?.forEach((item) => document.text(`${item.viewerName}: ${item.comments}`));

    document.moveDown(1);
    document.font("Helvetica-Bold").fontSize(14).text("Offers");
    (report?.offers as Array<{ amount: number; buyer: string; status: string }> | undefined)?.forEach((offer) => {
      document.font("Helvetica").fontSize(11).text(`£${offer.amount.toLocaleString("en-GB")} - ${offer.buyer} (${offer.status})`);
    });

    document.moveDown(1);
    document.font("Helvetica-Bold").fontSize(14).text("Notes");
    document.font("Helvetica").fontSize(11).text(report?.notes ?? "No notes provided.");

    document.end();
  });
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const report = await prisma.vendorReport.findFirst({ where: { id, userId: user.id } });

    if (!report) {
      return NextResponse.json({ message: "Report not found" }, { status: 404 });
    }

    const buffer = await createPdfBuffer(report);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${report.pdfFileName ?? "vendor-report.pdf"}"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}