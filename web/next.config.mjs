/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	output: "export",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	distDir: "out",
};

export default nextConfig;
