// biome-ignore lint/suspicious/noExplicitAny: type is unknown
export const jsonResponse = (data: any, status?: number) => {
	return new Response(JSON.stringify(data), {
		status: status || 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
