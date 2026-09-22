(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const imageSequence = (round, files) => files.map((file) => ({ kind: "image", round, file }));
  const videoMedia = (file, poster, title, duration) => ({ kind: "video", file, poster, title, duration });

  const storySets = [
    {
      number: "01",
      label: "A familiar opening",
      title: "Start with the life around the document",
      copy: "Travel preparation gave the work an easy, human entry point. The story moved from everyday practical advice to the certified documents that can make an international move possible.",
      role: "Awareness",
      action: "Make the need feel familiar",
      media: imageSequence("round-1", [
        "monday-13.jpg", "monday-14.jpg", "monday-15.jpg", "monday-16.jpg", "monday-17.jpg",
        "monday-18.jpg", "monday-19.jpg", "monday-20.jpg", "monday-21.jpg", "monday-22.jpg",
        "monday-23.jpg", "monday-24.jpg", "monday-25.jpg", "monday-26.jpg", "monday-27.jpg",
        "monday-28.jpg", "monday-29.jpg", "monday-30.jpg", "monday-31.jpg"
      ])
    },
    {
      number: "02",
      label: "Clarity before commitment",
      title: "Answer the doubts before they become blockers",
      copy: "The educational sequence made a specialist service easier to approach by answering the questions people carry into a quote, from machine translation myths to the different names used for certified work around the world.",
      role: "Education",
      action: "Build confidence through clarity",
      media: [
        ...imageSequence("round-2", [
          "monday-06.jpg", "monday-07.jpg", "monday-08.jpg", "monday-09.jpg", "monday-10.jpg",
          "monday-11.jpg", "monday-12.jpg"
        ]),
        ...imageSequence("round-1", [
          "wednesday-video-designs-32.jpg", "wednesday-video-designs-33.jpg", "wednesday-video-designs-34.jpg",
          "wednesday-video-designs-35.jpg", "wednesday-video-designs-36.jpg", "wednesday-video-designs-37.jpg",
          "wednesday-video-designs-38.jpg"
        ])
      ]
    },
    {
      number: "03",
      label: "A clear next step",
      title: "Turn official requirements into something people can act on",
      copy: "The final story set explained certified translation, legalisation, and apostille in practical terms, then pointed towards Translayte when the paperwork became consequential.",
      role: "Conversion",
      action: "Move from understanding to action",
      media: [
        ...imageSequence("round-2", [
          "wednesday-13.jpg", "wednesday-14.jpg", "wednesday-15.jpg", "wednesday-16.jpg",
        ]),
        ...imageSequence("round-1", [
          "friday-01.jpg", "friday-02.jpg", "friday-03.jpg", "friday-04.jpg", "friday-05.jpg",
          "friday-06.jpg", "friday-07.jpg", "friday-08.jpg", "friday-09.jpg", "friday-10.jpg",
          "friday-11.jpg", "friday-12.jpg"
        ]),
        ...imageSequence("round-2", [
          "friday-01.jpg", "friday-02.jpg", "friday-03.jpg", "friday-04.jpg", "friday-05.jpg"
        ])
      ],
      videos: [
        videoMedia("translayte-legalisation.mp4", "round-1/wednesday-video-designs-32.jpg", "Let's bust some myths about certified translations", "35 seconds"),
        videoMedia("translayte-legalisation-short.mp4", "round-2/wednesday-16.jpg", "Why do you need legalisation?", "20 seconds")
      ]
    }
  ];

  const dayOrder = { monday: 1, wednesday: 2, friday: 3 };
  const assets = storySets.flatMap((story) => story.media
    .filter((media) => media.kind === "image")
    .map((media) => ({ ...media, set: `set-${Number(story.number)}` })))
    .sort((a, b) => {
      const setDifference = Number(a.set.slice(4)) - Number(b.set.slice(4));
      if (setDifference) return setDifference;
      const aDay = a.file.split("-")[0];
      const bDay = b.file.split("-")[0];
      const dayDifference = (dayOrder[aDay] || 99) - (dayOrder[bDay] || 99);
      if (dayDifference) return dayDifference;
      const aNumber = Number(a.file.match(/(\d+)\.jpg$/)?.[1] || 0);
      const bNumber = Number(b.file.match(/(\d+)\.jpg$/)?.[1] || 0);
      return aNumber - bNumber;
    });

  const gallery = $("[data-asset-gallery]");
  const lightbox = $("[data-lightbox]");
  const lightboxImage = $("[data-lightbox-image]");
  const lightboxCaption = $("[data-lightbox-caption]");
  let visibleAssets = assets;
  let activeIndex = 0;

  function mediaPath(media) {
    if (media.kind === "video") return `../../assets/work/translayte-creative/video/${media.file}`;
    return `../../assets/work/translayte-creative/${media.round}/${media.file}`;
  }

  function renderStorySets() {
    const container = $("[data-story-sets]");
    if (!container) return;

    container.innerHTML = storySets.map((story, storyIndex) => `
      <article class="story-set ${storyIndex % 2 ? "story-set-reverse" : ""}" data-story-set>
        <div class="story-set-copy">
          <span class="story-set-label">${story.number} / ${story.label}</span>
          <h3>${story.title}</h3>
          <p>${story.copy}</p>
          <dl class="story-set-facts">
            <div><dt>Role</dt><dd>${story.role}</dd></div>
            <div><dt>Designed to</dt><dd>${story.action}</dd></div>
          </dl>
        </div>
        <div class="story-carousel" data-story-carousel data-story-index="${storyIndex}" aria-label="${story.title}">
          <div class="story-slides">
            ${story.media.map((media, mediaIndex) => media.kind === "video" ? `
              <figure class="story-slide ${mediaIndex === 0 ? "is-active" : ""}" data-story-slide="${mediaIndex}" ${mediaIndex === 0 ? "" : "hidden"}>
                <div class="story-video-frame">
                  <video controls muted loop playsinline preload="metadata" poster="../../assets/work/translayte-creative/${media.poster}" aria-label="${media.title}" data-story-video>
                    <source src="${mediaPath(media)}" type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                  <span class="story-video-label"><i class="ph ph-play" aria-hidden="true"></i> ${media.duration}</span>
                </div>
                <figcaption>${media.title}</figcaption>
              </figure>
            ` : `
              <figure class="story-slide ${mediaIndex === 0 ? "is-active" : ""}" data-story-slide="${mediaIndex}" ${mediaIndex === 0 ? "" : "hidden"}>
                <button type="button" class="story-image-button" data-story-image="${storyIndex}:${mediaIndex}" aria-label="Open visual ${mediaIndex + 1} of ${story.media.length}">
                  <img src="${mediaPath(media)}" alt="${story.title}" loading="${mediaIndex === 0 ? "eager" : "lazy"}" />
                </button>
              </figure>
            `).join("")}
          </div>
          <div class="story-carousel-controls">
            <button type="button" class="story-carousel-button" data-story-previous aria-label="Previous visual"><i class="ph ph-arrow-left" aria-hidden="true"></i></button>
            <span class="story-carousel-count"><span data-story-current>01</span> / ${String(story.media.length).padStart(2, "0")}</span>
            <button type="button" class="story-carousel-button" data-story-next aria-label="Next visual"><i class="ph ph-arrow-right" aria-hidden="true"></i></button>
          </div>
        </div>
      </article>
    `).join("");
  }

  function renderGallery(filter = "all") {
    if (!gallery) return;
    visibleAssets = assets.filter((asset) => filter === "all" || asset.set === filter);
    gallery.innerHTML = visibleAssets.map((asset, index) => {
      return `<figure class="asset-tile" data-asset-index="${index}"><img src="${mediaPath(asset)}" alt="Translayte content visual" loading="lazy" /></figure>`;
    }).join("");

    $$('[data-asset-index]', gallery).forEach((tile) => {
      tile.addEventListener("click", () => openLightbox(Number(tile.dataset.assetIndex)));
    });
  }

  function setStorySlide(carousel, nextIndex) {
    const slides = $$('[data-story-slide]', carousel);
    const current = Math.max(0, Math.min(nextIndex, slides.length - 1));
    slides.forEach((slide, index) => {
      const active = index === current;
      slide.classList.toggle("is-active", active);
      slide.hidden = !active;
      const video = $("video", slide);
      if (video) {
        if (active && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.play().catch(() => {});
        else video.pause();
      }
    });
    $("[data-story-current]", carousel).textContent = String(current + 1).padStart(2, "0");
    carousel.dataset.activeSlide = String(current);
  }

  function bindStoryCarousels() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $$('[data-story-carousel]').forEach((carousel) => {
      const slides = $$('[data-story-slide]', carousel);
      let timer;
      const advance = (direction = 1) => {
        const current = Number(carousel.dataset.activeSlide || 0);
        setStorySlide(carousel, (current + direction + slides.length) % slides.length);
      };
      const stop = () => {
        if (timer) window.clearInterval(timer);
      };
      const start = () => {
        if (!reducedMotion && !timer) timer = window.setInterval(() => advance(), 4200);
      };

      $("[data-story-previous]", carousel).addEventListener("click", () => { stop(); advance(-1); start(); });
      $("[data-story-next]", carousel).addEventListener("click", () => { stop(); advance(); start(); });
      carousel.addEventListener("mouseenter", stop);
      carousel.addEventListener("mouseleave", start);
      carousel.addEventListener("focusin", stop);
      carousel.addEventListener("focusout", (event) => {
        if (!carousel.contains(event.relatedTarget)) start();
      });
      $$('[data-story-image]', carousel).forEach((button) => {
        button.addEventListener("click", () => {
          const [, mediaIndex] = button.dataset.storyImage.split(":").map(Number);
          const story = storySets[Number(carousel.dataset.storyIndex)];
          const imageMedia = story.media[mediaIndex];
          visibleAssets = [imageMedia, ...story.media.filter((media) => media.kind === "image" && media !== imageMedia)];
          openLightbox(0);
        });
      });
      setStorySlide(carousel, 0);
      start();
    });
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    activeIndex = index;
    const asset = visibleAssets[activeIndex];
    if (!asset) return;
    lightboxImage.src = `../../assets/work/translayte-creative/${asset.round}/${asset.file}`;
    lightboxImage.alt = "Translayte campaign design";
    lightboxCaption.textContent = `${activeIndex + 1} of ${visibleAssets.length}`;
    lightbox.hidden = false;
    document.body.classList.add("drawer-open");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove("drawer-open");
  }

  function stepLightbox(direction) {
    const nextIndex = (activeIndex + direction + visibleAssets.length) % visibleAssets.length;
    openLightbox(nextIndex);
  }

  function bindEvents() {
    $$("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        $$("[data-filter]").forEach((item) => {
          const selected = item === button;
          item.classList.toggle("is-active", selected);
          item.setAttribute("aria-pressed", String(selected));
        });
        renderGallery(button.dataset.filter);
      });
    });

    const closeBtn = $("[data-lightbox-close]");
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    const prevBtn = $("[data-lightbox-previous]");
    if (prevBtn) prevBtn.addEventListener("click", () => stepLightbox(-1));
    const nextBtn = $("[data-lightbox-next]");
    if (nextBtn) nextBtn.addEventListener("click", () => stepLightbox(1));
    if (lightbox) {
      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
      });
    }
    document.addEventListener("keydown", (event) => {
      if (!lightbox || lightbox.hidden) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") stepLightbox(-1);
      if (event.key === "ArrowRight") stepLightbox(1);
    });
  }

  renderStorySets();
  renderGallery();
  bindStoryCarousels();
  bindEvents();
})();
