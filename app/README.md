# Youtube Playlist Client

This is a simple app that allow you to put a youtube playlist url, and spread all its videos.

Then, you can click on a cover, and an iFrame show up and let you consume it !

# What is used ?

Svelte, Axios, SCSS, Typescript (sort of 😅) and of course the Youtube Data V3 api.

---

## How is is structured ?

Wait...

You tought it was... organized ?

Like, for real ?

HAHAHA !

...

......

Okay.

    ./src
        App.svelte : Main file, lot of stuff going on here. Call of API, DOM manipulation, a lot...
        VideoCard.svelte : It is self explanatory.
    ./ApiRessources
        Playlist.ts : Sort of a service for the API call, and also a little helper function to extract query parameter from an URL. 

---

## Get started

First of all, you'll need an API key.

You have all the informations you need here : [Youtube Data Api Documentation](https://developers.google.com/youtube/v3/getting-started).

Then, you'll have to create and `.env` file with this pattern :
```
YT_API_KEY = YOUR_API_KEY
YT_API_URL = "https://youtube.googleapis.com/youtube/v3/"
YT_API_URL_PLAYLISTS_ITEM = "playlistItems"
YT_DEFAULT_PLAYLIST_URL="A_YOUTUBE_PLAYLIST_TO_ACT_AS_DEFAULT"
YT_DEFAULT_VIDEO_THUMBNAIL="AN_IMAGE_TO_ACT_AS_DEFAULT_WHEN_NOT_THUMBNAIL_FOUND"
```

Then, you install the dependencies...

```bash
cd app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see the app running.

You can specify an other PORT by adding a `--port` flag while running the server. 

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv).

## License
MIT &copy; 2021 - othomation