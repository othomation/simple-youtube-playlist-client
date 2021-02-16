import axios from "axios";

export const getPlaylistById = async (playListId: string, pageToken?: string) => {
	try {
		const response = await axios.get(process.env.YT_API_URL + process.env.YT_API_URL_PLAYLISTS_ITEM, {
			params: {
				part: "id,snippet,status",
				maxResult: 50,
				playlistId: playListId,
				pageToken: pageToken,
				prettyPrint: true,
				key: process.env.YT_API_KEY,
			},
		});
		return response;
	} catch (error) {
		console.error(error);
	}
};

export const getQueryParams = (params, url) => {
	let href = url;
	let reg = new RegExp("[?&]" + params + "=([^&#]*)", "i");
	let queryString = reg.exec(href);
	return queryString ? queryString[1] : null;
};
