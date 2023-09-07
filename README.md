# Gasteizko Rap Player

This music player is a tribute to the rap music from Vitoria and its surroundings from the 2000s, which was a significant part of my childhood. The tracks featured here are reminiscent of those times and bring back many memories.

**Note to Artists:** If any artist comes across this and wishes for their track to be removed, please do not hesitate to contact me at [iker@ikerocio.com](mailto:iker@ikerocio.com).

This project is based on [WilsonLe's react-music-player](https://github.com/WilsonLe/react-music-player) with some enhancements. It operates entirely on the frontend without the need for a backend.

## Authors

- **Iker Ocio Zuazo** - [Website](https://ikerocio.com)
- **Jonzoone** - [Instagram](https://www.instagram.com/jonzoonegraphics/)

## Getting Started

Follow the steps below to get the project up and running:

```bash
# 1. If you have not installed Yarn:
npm install yarn

# 2. Install the dependencies:
yarn install

# 3. Kick start the project in development mode:
yarn start
```

## Deployment

When you're ready to deploy the application to the internet, use:

```bash
yarn build
```

The project is automatically deployed on Vercel. You can access the live application at [https://gasteizko-rap-player.vercel.app/](https://gasteizko-rap-player.vercel.app/).

## Data Optimization

All songs have been exported to the m4a format to reduce the amount of data required for song streaming.

This conversion has reduced the size of 727 files **from 3.65GB to 2.45GB**.

![Data Reduction](data:image/svg+xml;utf8,<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="100" fill="white" /><rect x="30" y="10" width="40" height="80" fill="#4CAF50" /><rect x="130" y="25" width="40" height="65" fill="#FFC107" /><text x="50" y="95" font-family="Arial" font-size="12" fill="black">3.65GB</text><text x="150" y="95" font-family="Arial" font-size="12" fill="black">2.45GB</text></svg>)

## TODO

- Most prominent color is not well calculated in python script. Needs to be reviewed.
- In library, when mouse is hover a row, hand icon should be shown
- When you're listening a song, if you click on library button, you should see that song in scroll rows
- Random button to listen random songs
- Light/Dark button
- Button for options. Main buttons should be:
  - options - backward - play - forward - info
