const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Redis = require("ioredis");
const session = require("express-session");
const connectRedis = require("connect-redis");
const cookieParser = require("cookie-parser");
const path = require("path");

// ROUTERS
const authorizationRouter = require("./routes/authorization");
const authorizationPKCERouter = require("./routes/authorizationpkce");
const topTracksRouter = require("./routes/toplists/fetchTopTracks");
const topArtistsRouter = require("./routes/toplists/fetchTopArtists");
const userRouter = require("./routes/playlists/fetchUserInfo");
const playlistRouter = require("./routes/playlists/fetchPlaylists");
const likedRouter = require("./routes/playlists/fetchLiked");
const playlistTrackRouter = require("./routes/playlists/fetchPlaylistTracks");
const createPlaylistRouter = require("./routes/playlists/createPlaylist");
const addTrackRouter = require("./routes/playlists/addTracksToPlaylist");
const deleteTrackRouter = require("./routes/playlists/deletePlaylistTracks");
const unfollowPlaylistRouter = require("./routes/playlists/unfollowPlaylist");
const logoutRouter = require("./routes/logout");

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "fastspotfront", "build")));
app.use(cookieParser());

const client = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 100, // Adjust this value
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

const RedisStore = connectRedis(session);

app.set("trust proxy", 1);

app.use(
  session({
    store: new RedisStore({ client: client, logErrors: true }),
    name: "fast-spots-cookie",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Toggle based on environment
      httpOnly: true,
      maxAge: 1000 * 55 * 60,
      sameSite: "none",
    },
  })
);

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// AUTHORIZATION AND FETCHING ACCESS TOKENS
app.use(authorizationPKCERouter);
app.use(topTracksRouter);
app.use(topArtistsRouter);
app.use(userRouter);
app.use(playlistRouter);
app.use(likedRouter);
app.use(playlistTrackRouter);
app.use(createPlaylistRouter);
app.use(addTrackRouter);
app.use(deleteTrackRouter);
app.use(unfollowPlaylistRouter);
app.use(logoutRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "fastspotfront", "build", "index.html"));
});

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
