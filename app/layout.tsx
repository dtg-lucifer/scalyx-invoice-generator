import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-roboto",
	display: "swap",
});

const poppins = Poppins({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin"],
	variable: "--font-poppins",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Scalyx Invoice Generator — Simple & Powerful Invoicing",
	description: "Generate and download professional A4 PDF invoices with live preview for Scalyx.",
	icons: {
		icon: "/assets/scalyx_dark.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${roboto.variable} ${poppins.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 print:bg-white print:text-black font-poppins">{children}</body>
		</html>
	);
}
