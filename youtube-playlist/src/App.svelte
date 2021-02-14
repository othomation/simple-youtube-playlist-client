<script lang="ts">
	import { slide } from "svelte/transition";
	import type { AxiosResponse } from "axios";
	import { getPlaylistById, getQueryParams } from "../ApiRessources/Playlist";
	import VideoCard from "./VideoCard.svelte";
	export let appName: string;

	let themeToggle: boolean;
	let videosReadyToAppend: boolean = false;

	/* A sweeeeet interface <3 */
	interface videoData {
		playlistId: string;
		videoId: string;
		link: string;
		thumbnail: string;
		description: string;
		nextPageToken?: string;
		items?: object;
		title: string;
	}

	/* Default URL to be used in the input ! */
	let defaultUrl = process.env.YT_DEFAULT_PLAYLIST_URL;

	/* To store temporary and non temporary data realated to videos */
	let videos = [];
	let data = [];

	let videosData: Array<videoData> = [];
	let videoData: null | videoData = null;

	/* DOM Binded Elements */
	let playlistsContainer;
	let iframeModal;
	let iframeModalClose;
	let playlistForm;

	/* Returnan object  */
	const buildVideoData = (video) => {
		const videoId = video.snippet.resourceId.videoId;
		const playlistId = video.snippet.playlistId;
		const thumbnail =
			Object.entries(video.snippet.thumbnails).length > 0
				? video.snippet.thumbnails.maxres !== undefined
					? video.snippet.thumbnails.maxres.url
					: video.snippet.thumbnails.high !== undefined
					? video.snippet.thumbnails.high.url
					: video.snippet.thumbnails.default.url
				: process.env.YT_DEFAULT_VIDEO_THUMBNAIL;
		const link = `https://youtube.com/watch?v=${videoId}&list=${playlistId}`;
		const description = video.snippet.description
		const title = video.snippet.title;

		videoData = {
			playlistId,
			videoId,
			thumbnail,
			link,
			description,
			title,
		};

		return videoData;
	};

	/* A regex for matching youtubes playlist url */
	const ytRegex = /((http(s)?:\/\/)?)(www\.)((youtube\.com\/)|(youtu.be\/))(playlist\?list=)[\S]+/;

	/* A function to handle click event to do api call */
	const getPlaylistOnSubmit = (event) => {
		event.preventDefault();
		if (!ytRegex.test(defaultUrl)) {
			alert("Enter a valid youtube url please...");
			return;
		}
		const playlistId = getQueryParams("list", defaultUrl);
		getByPlaylistId(playlistId);
	};

	/* Okay this one does too much, I know. 
	It do the API call, then it check if there is other data not fetched (because youtube API has a limit per page result)
	then it will create the array with all data needed to invoke VideoCard component ! 
	*/
	const getByPlaylistId = async (playlistId) => {
		const res: AxiosResponse = await getPlaylistById(playlistId);
		videos = [];
		videosData = [];

		if (data.length > 0) data = [];

		data.push(res.data);

		if (res.data.nextPageToken !== undefined) {
			const totalResult = res.data.pageInfo.totalResults;
			const resultPerPage = res.data.pageInfo.resultsPerPage;
			let numberOfCalls = (totalResult % resultPerPage) * 2;
			while (numberOfCalls >= 0) {
				const res2 = await getPlaylistById(playlistId, data[data.length - 1].nextPageToken);
				data.push(res2.data);
				numberOfCalls--;
			}
		}

		data.forEach((chunk) => videos.push(...chunk.items));

		playlistsContainer.innerHTML = "";

		videos.forEach((video) => {
			if (video.status.privacyStatus !== "private") {
				videosData.push(buildVideoData(video));
			}
		});
		videosReadyToAppend = true;
		playlistForm.style.display = "none";
	};

	const toggleTheme = () => {
		themeToggle = !themeToggle;
	};

	/* Listen to an event fired by the VideoCard component and show the iframe ! */
	const handleIframeEvent = (event) => {
		const videoId = event.detail.videoId;
		const playlistId = event.detail.playlistId;
		const videoTitle = event.detail.title;
		iframeModal.innerHTML = `
			<iframe
				title="${videoTitle}"
				id="ytplayer"
				type="text/html"
				height="100%";
				width="100%";
				src="https://www.youtube.com/embed/${videoId}?list=${playlistId}"
				frameborder="0"
				allowfullscreen
				style="border-radius: 1em;
					   box-shadow: 0 0 20px 0px black;"
			/>
		`;
		iframeModalClose.style.display = "inline-block";
		iframeModal.style.display = "block";
	};

	const closeIframeModal = () => {
		iframeModalClose.style.display = iframeModal.style.display = "none";
	};
</script>

<span id="iframe-modal-close" bind:this={iframeModalClose} on:click={closeIframeModal}>❌</span>
<div id="iframe-modal" bind:this={iframeModal} />

<main class={themeToggle ? "lightTheme" : "darkTheme"}>
	<span class="toggleTheme" on:click={toggleTheme}>🌙</span>
	<header>
		<h1>{appName}</h1>
	</header>

	<section class="playlist__form" bind:this={playlistForm}>
		<article>
			<input type="text" bind:value={defaultUrl} />
		</article>
		<button type="submit" value="Go !" on:click|once={getPlaylistOnSubmit}>Go</button>
	</section>

	<section class="playlist__videos" bind:this={playlistsContainer}>
		<h3>
			Videos will appear here
			<div id="wave">
				<span class="dot" />
				<span class="dot" />
				<span class="dot" />
			</div>
		</h3>
		{#if videosReadyToAppend}
			{#each videosData as video}
				<article class="video--card" transition:slide>
					<VideoCard on:videoId={handleIframeEvent} videoInfo={video} />
				</article>
			{/each}
		{/if}
	</section>
</main>

<style lang="scss">
	.lightTheme {
		--background: #fcfcfc;
		--color: #1d1d1d;
	}
	.darkTheme {
		--background: #1d1d1d;
		--color: #fcfcfc;
	}
	#iframe-modal-close {
		display: none;
		cursor: pointer;
		position: fixed;
		top: 3rem;
		left: 0.2rem;
		font-size: 2rem;
		transition: all 1s ease-in-out;
		&:hover {
			filter: invert(1);
			transform: scale(1.2);
		}
	}
	#iframe-modal {
		display: none;
		position: fixed;
		width: 80vw;
		left: 50%;
		height: 45vw;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.toggleTheme {
		cursor: pointer;
		position: fixed;
		top: 0.2rem;
		left: 0.2rem;
		font-size: 2rem;
		transition: all 1s ease-in-out;
		&:hover {
			filter: invert(1);
			transform: scale(1.2);
		}
	}
	main {
		background-color: var(--background);
	}

	header {
		text-align: center;
		text-overflow: clip;
		> h1 {
			margin-bottom: 2rem;
			font-size: 4rem;
			color: var(--color);
		}
	}

	.playlist__form {
		> article {
			display: flex;
			input {
				width: 100%;
				padding: 1rem;
				text-align: center;
				border: none;
				background: var(--color);
				color: var(--background);
				font-size: 1.2rem;
				border-radius: 0.5rem;
			}
		}

		button {
			cursor: pointer;
			margin: 1rem auto;
			border: none;
			font-size: 1.5rem;
			padding: 0.5rem 4rem;
			border-radius: 0.5rem;
			background: var(--color);
			color: var(--background);
		}

		display: flex;
		flex-direction: column;
		margin: 1rem auto;
		max-width: 80%;
	}

	.playlist__videos {
		> h3 {
			background: var(--background);
			padding: 2rem;
			text-align: center;
			border-radius: 1.5rem;
			font-size: 3rem;
			color: var(--color);
		}
	}
	div#wave {
		user-select: none;
		text-align: center;
		width: 100px;
		height: 100px;
		margin-left: auto;
		margin-right: auto;
		.dot {
			display: inline-block;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			margin-right: 3px;
			background: var(--color);
			animation: wave 1.3s linear infinite;

			&:nth-child(2) {
				animation-delay: -1.1s;
			}

			&:nth-child(3) {
				animation-delay: -0.9s;
			}
		}
	}

	@keyframes wave {
		0%,
		60%,
		100% {
			transform: initial;
		}

		30% {
			transform: translateY(-15px);
		}
	}
</style>
