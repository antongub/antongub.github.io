import {AsciiBucket} from "./modules/banner.js";

const banner = document.getElementsByClassName("banner")[0];
let intervalToken;

function clearIntervalToken() {
  clearInterval(intervalToken);
  intervalToken = null;
}

function setup() {
  banner.innerHTML = "";
  if (intervalToken) clearIntervalToken();

  const bannerEffect = new AsciiBucket(banner);
  intervalToken = setInterval(() => {
    bannerEffect.changeContent();
  }, 200)
}

window.addEventListener('resize', function (event) {
  setup();
}, true);

setup();
