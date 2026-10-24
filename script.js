"use strict";

const CONFIG = {
  letter: [
    "haii sayaanggg, happy anniverssary. 2 tahun bukan waktu yang singkat sayang, makasii dan maaaf yaa sayang. dan terimakasi untuk kebahagian kebahagiaan yang selalu kamu kasi ke aku, aku selalu bahagiaa. kitaa lewatin badainya sama sama yaaa sayang, okayy. maaf untuk hal hal yang selalu bikin kamu cape terutama aku masi belum ngertiin pas kamu lagi cape kerja, dan aku selalu salah paham. maaaf ya seng next kitaaa ubah sifat buruk kita masing masing yaaa. happy anniverssary untuk yang ke 2 tahun ini yaa sayangkuuu‼️",
    "ga kerasa ya udah 2 tahun aja kita bareng. makasih udah bertahan sejauh ini, udah jadi bagian dari hari-hari aku, dan masih mau jalanin semuanya sama aku. kita emang ga selalu sempurna, kadang ada berantem, beda pendapat, atau hal-hal kecil yang bikin kesel, tapi i'm glad we still choose each other. semoga ke depannya kita bisa terus tumbuh bareng, saling ngerti, dan tetep jadi tempat pulang satu sama lain. happy anniversary, love u always!"
  ]
};

const opening = document.querySelector("#opening");
const openSurpriseButton = document.querySelector("#open-surprise");
const siteContent = document.querySelector("#main-content");
const ambientHearts = document.querySelector("#ambient-hearts");
const audio = document.querySelector("#birthday-audio");
const audioSource = audio.querySelector("source").getAttribute("src");
const musicToggle = document.querySelector("#music-toggle");
const finalMusicToggle = document.querySelector("#final-music-toggle");
const musicPlayer = document.querySelector(".music-player");
const musicStatus = document.querySelector("#music-status");
const progress = document.querySelector("#music-progress");
const volume = document.querySelector("#music-volume");
const musicTime = document.querySelector("#music-time");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const book = createBookExperience();
let heartTimer;

function createBookExperience() {
  const header = siteContent.querySelector(".site-header");
  const sectionGroups = [
    ["#home", ".music-section"],
    ["#memories"],
    ["#videos"],
    ["#story"],
    ["#letter"],
    ["#wishes"],
    ["#final-surprise"]
  ];
  const experience = document.createElement("div");
  experience.className = "book-experience";
  const stage = document.createElement("div");
  stage.className = "book-stage";
  stage.setAttribute("aria-label", "Buku cerita ulang tahun");
  const controls = document.createElement("div");
  controls.className = "book-controls";

  header.classList.add("book-header");
  experience.append(header, stage);

  const pages = [];
  sectionGroups.forEach((selectors, index) => {
    const spreadIndex = Math.floor(index / 2);
    let spread = stage.querySelectorAll(".book-spread")[spreadIndex];
    if (!spread) {
      spread = document.createElement("div");
      spread.className = "book-spread";
      spread.hidden = true;
      stage.append(spread);
    }

    const page = createPage(index);
    const inner = page.querySelector(".book-page-inner");
    selectors.forEach((selector) => {
      const section = siteContent.querySelector(selector);
      if (section) {
        inner.append(section);
      }
    });
    spread.append(page);
    pages.push(page);
  });

  if (pages.length % 2 === 1) {
    const spread = stage.querySelectorAll(".book-spread")[Math.floor(pages.length / 2)];
    const blankPage = createPage(pages.length, true);
    spread.append(blankPage);
    pages.push(blankPage);
  }

  const previousButton = document.createElement("button");
  previousButton.className = "book-nav-button book-previous";
  previousButton.type = "button";
  previousButton.textContent = "Previous Page";
  previousButton.setAttribute("aria-label", "Previous Page");

  const pageIndicator = document.createElement("span");
  pageIndicator.className = "book-page-indicator";
  pageIndicator.setAttribute("aria-live", "polite");

  const nextButton = document.createElement("button");
  nextButton.className = "book-nav-button book-next";
  nextButton.type = "button";
  nextButton.textContent = "Next Page";
  nextButton.setAttribute("aria-label", "Next Page");
  controls.append(previousButton, pageIndicator, nextButton);
  experience.append(controls);
  siteContent.replaceChildren(experience);

  return {
    experience,
    stage,
    spreads: [...stage.querySelectorAll(".book-spread")],
    pages,
    previousButton,
    nextButton,
    pageIndicator,
    pageIndex: 0,
    isTurning: false,
    isMobile: window.matchMedia("(max-width: 700px)")
  };
}

function createPage(pageIndex, isBlank = false) {
  const page = document.createElement("article");
  page.className = `book-page${isBlank ? " book-page-blank" : ""}`;
  page.dataset.pageIndex = String(pageIndex);
  page.setAttribute("aria-label", isBlank ? "Halaman penutup buku" : `Halaman ${pageIndex + 1}`);

  const inner = document.createElement("div");
  inner.className = "book-page-inner";
  page.append(inner);

  const number = document.createElement("span");
  number.className = "book-page-number";
  number.textContent = String(pageIndex + 1).padStart(2, "0");
  page.append(number);
  return page;
}

function syncBook() {
  const spreadIndex = Math.floor(book.pageIndex / 2);
  book.spreads.forEach((spread, index) => {
    const isActive = index === spreadIndex;
    spread.hidden = !isActive;
    spread.classList.toggle("is-active", isActive);
    [...spread.children].forEach((page) => {
      const pageIndex = Number(page.dataset.pageIndex);
      const isCurrentOnMobile = !book.isMobile.matches || pageIndex === book.pageIndex;
      page.hidden = !isActive || !isCurrentOnMobile;
      page.setAttribute("aria-hidden", String(!isActive || !isCurrentOnMobile));
    });
  });

  const pageCount = book.pages.length;
  const startIndex = book.isMobile.matches ? book.pageIndex : spreadIndex * 2;
  if (book.isMobile.matches) {
    book.pageIndicator.textContent = `${String(book.pageIndex + 1).padStart(2, "0")} / ${String(pageCount).padStart(2, "0")}`;
  } else {
    book.pageIndicator.textContent = `${String(startIndex + 1).padStart(2, "0")}–${String(Math.min(startIndex + 2, pageCount)).padStart(2, "0")} / ${String(pageCount).padStart(2, "0")}`;
  }
  book.previousButton.disabled = book.pageIndex === 0 || book.isTurning;
  book.nextButton.disabled = book.pageIndex >= pageCount - (book.isMobile.matches ? 1 : 2) || book.isTurning;

  const finalSection = document.querySelector("#final-surprise");
  if (finalSection && finalSection.closest(".book-page")?.getAttribute("aria-hidden") === "false") {
    revealFinalHeart(finalSection);
  }
}

function createTurnFace(sourcePage, className) {
  const face = document.createElement("div");
  face.className = `book-turn-face ${className}`;
  face.setAttribute("aria-hidden", "true");
  const sourceInner = sourcePage?.querySelector(".book-page-inner");
  if (!sourceInner) {
    return face;
  }

  const clone = sourceInner.cloneNode(true);
  clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
  clone.querySelectorAll(".reveal").forEach((element) => {
    element.classList.remove("reveal");
    element.classList.add("is-visible");
  });
  clone.querySelectorAll("video").forEach((video) => {
    const poster = document.createElement("div");
    poster.className = "book-turn-video";
    if (video.poster) {
      poster.style.backgroundImage = `url("${video.poster}")`;
    }
    video.replaceWith(poster);
  });
  clone.querySelectorAll("audio, canvas").forEach((element) => element.remove());
  clone.querySelectorAll("button, input, select, textarea").forEach((element) => {
    element.disabled = true;
  });
  clone.querySelectorAll("a").forEach((element) => element.removeAttribute("href"));
  face.append(clone);
  return face;
}

function turnBook(direction, targetPageIndex) {
  if (book.isTurning || targetPageIndex < 0 || targetPageIndex >= book.pages.length) {
    return;
  }

  const mobile = book.isMobile.matches;
  const spreadStart = Math.floor(book.pageIndex / 2) * 2;
  const outgoingIndex = mobile
    ? book.pageIndex
    : direction === "forward" ? spreadStart + 1 : spreadStart;
  const incomingIndex = !mobile && direction === "backward"
    ? spreadStart - 1
    : targetPageIndex;
  const turner = document.createElement("div");
  turner.className = `book-turner is-turning-${direction}${mobile ? " is-mobile-turn" : ""}`;
  turner.append(
    createTurnFace(book.pages[outgoingIndex], "book-turn-front"),
    createTurnFace(book.pages[incomingIndex], "book-turn-back")
  );
  book.stage.append(turner);
  book.isTurning = true;
  syncBook();

  const finishTurn = () => {
    if (!book.isTurning) {
      return;
    }
    book.pageIndex = targetPageIndex;
    book.isTurning = false;
    turner.remove();
    book.pages[targetPageIndex].querySelector(".book-page-inner").scrollTop = 0;
    syncBook();
  };

  turner.addEventListener("animationend", finishTurn, { once: true });
  window.setTimeout(finishTurn, reducedMotion.matches ? 50 : 1200);
}

function revealFinalHeart(finalSection) {
  const heart = document.querySelector(".opening-heart-moment");
  if (!heart || heart.parentElement === finalSection) {
    return;
  }

  finalSection.append(heart);
  requestAnimationFrame(() => finalSection.classList.add("is-heart-reveal"));
}

function goToBookPage(pageIndex) {
  if (book.isTurning || pageIndex < 0 || pageIndex >= book.pages.length) {
    return;
  }

  if (!book.isMobile.matches) {
    pageIndex = Math.floor(pageIndex / 2) * 2;
  }
  if (pageIndex === book.pageIndex) {
    return;
  }
  turnBook(pageIndex > book.pageIndex ? "forward" : "backward", pageIndex);
}

function moveBookPage(direction) {
  if (book.isTurning) {
    return;
  }
  const mobile = book.isMobile.matches;
  const step = mobile ? 1 : 2;
  const currentIndex = mobile ? book.pageIndex : Math.floor(book.pageIndex / 2) * 2;
  const targetPageIndex = direction === "forward"
    ? currentIndex + step
    : Math.max(0, currentIndex - step);
  turnBook(direction, targetPageIndex);
}

book.previousButton.addEventListener("click", () => moveBookPage("backward"));
book.nextButton.addEventListener("click", () => moveBookPage("forward"));
book.isMobile.addEventListener("change", syncBook);
window.addEventListener("resize", syncBook);
syncBook();

let swipeStart = null;
book.stage.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, a, input, video, audio, dialog")) {
    swipeStart = null;
    return;
  }
  swipeStart = { x: event.clientX, y: event.clientY };
});
book.stage.addEventListener("pointerup", (event) => {
  if (!swipeStart) {
    return;
  }
  const deltaX = event.clientX - swipeStart.x;
  const deltaY = event.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(deltaX) > 65 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35) {
    moveBookPage(deltaX < 0 ? "forward" : "backward");
  }
});
book.stage.addEventListener("pointercancel", () => {
  swipeStart = null;
});

document.addEventListener("keydown", (event) => {
  if (siteContent.hidden || lightbox.open || book.isTurning) {
    return;
  }
  if (event.target.closest("input, textarea, select, [contenteditable='true']")) {
    return;
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveBookPage("forward");
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveBookPage("backward");
  }
});

siteContent.addEventListener("click", (event) => {
  const link = event.target.closest("a[href^='#']");
  if (!link) {
    return;
  }
  const target = document.querySelector(link.getAttribute("href"));
  const page = target?.closest(".book-page");
  if (!page) {
    return;
  }
  event.preventDefault();
  history.replaceState(null, "", link.getAttribute("href"));
  goToBookPage(Number(page.dataset.pageIndex));
  if (Number(page.dataset.pageIndex) === book.pageIndex) {
    target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
  }
});

function createAmbientHeart() {
  if (reducedMotion.matches || ambientHearts.childElementCount >= 7) {
    return;
  }

  const heart = document.createElement("span");
  heart.className = "ambient-heart";
  heart.textContent = "♡";
  heart.style.setProperty("--heart-left", `${8 + Math.random() * 84}%`);
  heart.style.setProperty("--heart-size", `${12 + Math.random() * 10}px`);
  heart.style.setProperty("--heart-duration", `${8 + Math.random() * 4}s`);
  heart.style.setProperty("--heart-drift", `${Math.round((Math.random() - 0.5) * 70)}px`);
  heart.addEventListener("animationend", () => heart.remove(), { once: true });
  ambientHearts.append(heart);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function setMusicPlaying(isPlaying) {
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "Jeda musik" : "Putar musik");
  musicToggle.querySelector(".play-icon").textContent = isPlaying ? "Ⅱ" : "▶";
  finalMusicToggle.setAttribute("aria-pressed", String(isPlaying));
  finalMusicToggle.setAttribute("aria-label", isPlaying ? "Jeda musik" : "Putar musik");
  finalMusicToggle.querySelector(".final-play-icon").textContent = isPlaying ? "Ⅱ" : "▶";
  finalMusicToggle.querySelector(".final-music-label").textContent = isPlaying ? "Jeda musik" : "Putar musik";
  musicPlayer.classList.toggle("is-playing", isPlaying);
}

function showMusicError(message) {
  setMusicPlaying(false);
  musicStatus.textContent = message;
}

async function startMusic() {
  if (!audio.paused) {
    return;
  }

  try {
    await audio.play();
    musicStatus.textContent = "Sedang memutar lagu pilihanmu.";
  } catch (error) {
    if (error.name === "NotAllowedError") {
      musicStatus.textContent = "Klik “Buka hadiahmu” untuk mulai mendengarkan musik.";
      return;
    }

    showMusicError(`Musik belum bisa diputar. Pastikan file ${audioSource} tersedia dan formatnya MP3.`);
    console.error("Audio playback failed:", error);
  }
}

async function toggleMusic() {
  if (audio.paused) {
    await startMusic();
    return;
  }

  audio.pause();
}

openSurpriseButton.addEventListener("click", () => {
  siteContent.hidden = false;
  siteContent.classList.add("is-revealing");

  const finishOpening = () => {
    opening.hidden = true;
    siteContent.classList.remove("is-revealing");
    siteContent.classList.add("is-book-open");
    syncBook();
  };

  if (!reducedMotion.matches) {
    opening.classList.add("is-heart-moment");
    window.setTimeout(() => {
      opening.classList.add("is-leaving");
      window.setTimeout(finishOpening, 1250);
    }, 3500);
    createAmbientHeart();
    heartTimer = window.setInterval(createAmbientHeart, 1500);
  } else {
    opening.classList.add("is-leaving");
    window.setTimeout(finishOpening, 1250);
  }

  void startMusic();
});

musicToggle.addEventListener("click", () => {
  void toggleMusic();
});

finalMusicToggle.addEventListener("click", () => {
  void toggleMusic();
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

audio.volume = Number(volume.value);

audio.addEventListener("play", () => setMusicPlaying(true));
audio.addEventListener("pause", () => setMusicPlaying(false));
audio.addEventListener("timeupdate", () => {
  musicTime.textContent = formatTime(audio.currentTime);
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    const percentage = (audio.currentTime / audio.duration) * 100;
    progress.value = percentage.toString();
    progress.setAttribute("aria-valuetext", `${Math.round(percentage)}%`);
  }
});

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  }
});

audio.addEventListener("loadedmetadata", () => {
  musicStatus.textContent = "Lagu siap diputar. Semoga jadi soundtrack yang manis untuk hari ini.";
});

audio.addEventListener("error", () => {
  showMusicError(`Lagu belum ditemukan. Pastikan file MP3 ada di ${audioSource}.`);
});

document.querySelectorAll(".memory-photo img, .timeline-photo img").forEach((image) => {
  const handleLoad = () => {
    image.hidden = false;
    image.classList.add("is-loaded");
    const timelinePhoto = image.closest(".timeline-photo");
    if (timelinePhoto) {
      timelinePhoto.style.aspectRatio = `${image.naturalWidth} / ${image.naturalHeight}`;
    }
    const photoButton = image.closest(".memory-photo");
    if (photoButton) {
      photoButton.classList.remove("has-missing-image");
      photoButton.disabled = false;
    }
  };

  const handleError = () => {
    image.hidden = true;
    const photoButton = image.closest(".memory-photo");
    if (photoButton) {
      photoButton.classList.add("has-missing-image");
      photoButton.disabled = true;
    }
  };

  image.addEventListener("load", handleLoad);
  image.addEventListener("error", handleError);
  if (image.complete) {
    if (image.naturalWidth > 0) {
      handleLoad();
    } else {
      handleError();
    }
  }
});

document.querySelectorAll(".memory-photo").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.disabled) {
      return;
    }

    const image = button.querySelector("img");
    lightboxImage.src = button.dataset.photo;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = button.dataset.caption;
    lightbox.showModal();
  });
});

function closeLightbox() {
  if (lightbox.open) {
    lightbox.close();
  }
}

document.querySelector("#lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});
lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
});

const envelopeButton = document.querySelector("#envelope-button");
const loveLetter = document.querySelector("#love-letter");
const envelopeHint = document.querySelector("#envelope-hint");
const letterContent = document.querySelector("#letter-content");

CONFIG.letter.forEach((paragraph) => {
  const element = document.createElement("p");
  element.textContent = paragraph;
  letterContent.append(element);
});

envelopeButton.addEventListener("click", () => {
  const isOpen = envelopeButton.getAttribute("aria-expanded") === "true";
  envelopeButton.setAttribute("aria-expanded", String(!isOpen));
  envelopeButton.classList.toggle("is-open", !isOpen);
  loveLetter.hidden = isOpen;
  envelopeHint.textContent = isOpen ? "ketuk untuk membuka surat" : "surat kecil, dari aku untuk kamu";

  if (!isOpen && !reducedMotion.matches) {
    window.setTimeout(() => loveLetter.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  }
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const finalSection = document.querySelector("#final-surprise");
const confettiCanvas = document.querySelector("#confetti-canvas");
const confettiContext = confettiCanvas.getContext("2d");
let confettiFrame = 0;

function startConfetti() {
  if (reducedMotion.matches || !confettiContext || confettiFrame) {
    return;
  }

  const bounds = finalSection.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  confettiCanvas.width = Math.floor(bounds.width * pixelRatio);
  confettiCanvas.height = Math.floor(bounds.height * pixelRatio);
  confettiContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const colors = ["#b58b67", "#d8b997", "#f5ebdd", "#8c6951"];
  const pieces = Array.from({ length: 64 }, () => ({
    x: Math.random() * bounds.width,
    y: Math.random() * -bounds.height,
    size: 2 + Math.random() * 3,
    speed: 0.35 + Math.random() * 0.85,
    drift: (Math.random() - 0.5) * 0.45,
    rotation: Math.random() * Math.PI,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
  let frameCount = 0;

  const draw = () => {
    confettiContext.clearRect(0, 0, bounds.width, bounds.height);
    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.rotation += 0.008;

      if (piece.y > bounds.height) {
        piece.y = -5;
        piece.x = Math.random() * bounds.width;
      }

      confettiContext.save();
      confettiContext.translate(piece.x, piece.y);
      confettiContext.rotate(piece.rotation);
      confettiContext.fillStyle = piece.color;
      confettiContext.globalAlpha = 0.68;
      confettiContext.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.6);
      confettiContext.restore();
    });

    frameCount += 1;
    if (frameCount < 360) {
      confettiFrame = window.requestAnimationFrame(draw);
    } else {
      window.cancelAnimationFrame(confettiFrame);
      confettiFrame = 0;
      confettiContext.clearRect(0, 0, bounds.width, bounds.height);
    }
  };

  confettiFrame = window.requestAnimationFrame(draw);
}

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const confettiObserver = new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      startConfetti();
      observer.disconnect();
    }
  }, { threshold: 0.25 });
  confettiObserver.observe(finalSection);
}
