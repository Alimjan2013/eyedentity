# Junction 2024: EyeDentity

We aim to make Finland the world leader of digital democracy and ensuring human participation on the Polis platform while maintaining anonymity. To address the issues, we created a human identifying tool based on deep gazing detection. It can be easily integrated with online vote platforms and provides light-weight verification and progress tracking solution.

[Video Demo: EyeDentity](https://youtu.be/OQfNrrYMaao)

## run on local

```shell
git clone git@github.com:James-Leste/eyedentity.git
cd eyedentity
npm i
npm run dev
```

## Try online demo

[demo](https://eyedentity-hazel.vercel.app)

**Note:** If the demo doesn't work for you or the camera is not being display, try:

-   refreashing the page
-   switching to one of the supported browsers
-   turning the camera permission off and on again
-   opening the link in incognito mode and provide the camera permission on the browser.

## Screenshots

![alt text](imgs/eyetracking.gif)
_Figure 1. gaze tracking_
![alt text](imgs/voting.gif)
_Figure 2. [voting progress tracking simulator](https://github.com/Alimjan2013/is-ali/tree/main/app/polis) made by [Ali](https://github.com/Alimjan2013)_

## Supported Broswers

![alt text](browsers.png)

## Deep Model Used

[WebGazer.js from Brown University](https://webgazer.cs.brown.edu/#publication)

## Team members

-   James: [LinkedIn](https://www.linkedin.com/in/ziqi-wang-21baa8298/) [GitHub](https://github.com/James-Leste)
-   Ali: [LinkedIn](https://www.linkedin.com/in/alimjan-ablimit/) [GitHub](https://github.com/Alimjan2013)
-   Sean: [LinkedIn](https://www.linkedin.com/in/sihang-yu/) [GitHub](https://github.com/SihangYu7)

## Contribute

Create a pull request or issue! We would love to hear from you! We will review it as soon as we can!

## License

[GNU GENERAL PUBLIC LICENSE](https://github.com/James-Leste/eyedentity/blob/main/LICENSE.md)
