import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GlobeHemisphereWest,
  MagnifyingGlass,
  PaintBrush,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import catalog from "./data/catalog.json";
import { routeMetadata, siteContent } from "./site-content.js";

const PAGE_SIZE = 18;
const FEATURED_ORDER = [100, 150, 182, 227];
const FEATURED_RANK = new Map(FEATURED_ORDER.map((number, index) => [number, index]));
const PUBLIC_ROUTES = new Set([
  "/",
  "/works",
  "/about",
  "/projects",
  "/projects/human-trust",
  "/projects/archive-of-passing",
  "/contact",
]);

const copy = {
  en: {
    artistLine: "OIL PAINTING · BETWEEN EUROPE AND ASIA",
    heroTitle: ["Colour,", "texture,", "memory"],
    heroIntro:
      "Oil paintings shaped by movement, touch and the quiet persistence of colour.",
    browse: "View works",
    story: "Read the story",
    works: "works",
    available: "available",
    projects: "ongoing projects",
    heroArtAlt: "A studio arrangement of four oil paintings by Jan Tar",
    longHushAlt: "Long Hush, a tall peach and earth-toned oil painting",
    silentDriftAlt: "Silent Drift, a blue oil painting on an easel",
    whispersAlt: "Whispers of Dawn, a yellow and violet oil painting on an easel",
    echoAlt: "Ebullient Echo, an orange oil painting on an easel",
    aboutLabel: "ABOUT THE ARTIST",
    aboutTitle:
      "Jan Tar is a Ukrainian artist whose practice grows through painting, travel, music and human encounters.",
    aboutBody:
      "His works are traces of places, conversations and inner states. The road is not simply a subject, but a method of seeing and collecting memory.",
    factWorksValue: "200+",
    factWorksLabel: "oil paintings",
    factPlaceValue: "Europe · Asia",
    factPlaceLabel: "a studio in motion",
    factPracticeValue: "painting · music",
    factPracticeLabel: "film · technology",
    textureAlt: "Close-up of yellow and violet impasto from Whispers of Dawn",
    collectionLabel: "COLLECTION 2026",
    collectionTitle: "Original oil paintings",
    collectionIntro:
      "Search the living catalogue by title, number or SKU and filter by material, size, price or availability.",
    searchLabel: "Search the catalog",
    searchPlaceholder: "Title, number or SKU",
    material: "Material",
    allMaterials: "All",
    canvas: "Canvas",
    board: "Canvas board",
    size: "Size",
    allSizes: "All",
    price: "Price",
    allPrices: "All",
    upTo130: "Up to €130",
    upTo150: "Up to €150",
    above150: "Above €150",
    status: "Status",
    allStatuses: "All",
    statusAvailable: "Available",
    statusReview: "Needs review",
    sort: "Sort",
    curated: "Editorial selection",
    numberAsc: "Number: low to high",
    numberDesc: "Number: high to low",
    priceAsc: "Price: low to high",
    priceDesc: "Price: high to low",
    results: "works found",
    clear: "Clear filters",
    loadMore: "Show more works",
    noResults: "No works match these filters.",
    details: "Work details",
    close: "Close",
    previousImage: "Previous image",
    nextImage: "Next image",
    image: "Image",
    of: "of",
    dimensions: "Dimensions",
    location: "Created in",
    sku: "SKU",
    priceLabel: "Price",
    pending: "To be confirmed",
    enquire: "Enquire about this work",
    previousWork: "Previous work",
    nextWork: "Next work",
    contactTitle: "For exhibitions, collaborations and artwork enquiries",
    archiveNote:
      "Painting, travel and human connection — a living archive by Ukrainian artist Jan Tar.",
    rights: "All rights reserved.",
  },
  ru: {
    artistLine: "МАСЛЯНАЯ ЖИВОПИСЬ · МЕЖДУ ЕВРОПОЙ И АЗИЕЙ",
    heroTitle: ["Цвет,", "фактура,", "память"],
    heroIntro:
      "Живопись маслом, построенная на движении, прикосновении и тихой силе цвета.",
    browse: "Смотреть работы",
    story: "Читать историю",
    works: "работ",
    available: "в продаже",
    projects: "развивающихся проекта",
    heroArtAlt: "Студийная композиция из четырёх картин Яна Тара",
    longHushAlt: "Long Hush — высокая картина в персиковых и земляных тонах",
    silentDriftAlt: "Silent Drift — голубая картина маслом на мольберте",
    whispersAlt: "Whispers of Dawn — жёлто-фиолетовая картина на мольберте",
    echoAlt: "Ebullient Echo — оранжевая картина на мольберте",
    aboutLabel: "О ХУДОЖНИКЕ",
    aboutTitle:
      "Jan Tar — украинский художник, чья практика растёт через живопись, путешествия, музыку и человеческие встречи.",
    aboutBody:
      "Его работы становятся следами мест, разговоров и внутренних состояний. Дорога здесь не просто тема, а способ видеть и собирать память.",
    factWorksValue: "200+",
    factWorksLabel: "картин маслом",
    factPlaceValue: "Европа · Азия",
    factPlaceLabel: "мастерская в движении",
    factPracticeValue: "живопись · музыка",
    factPracticeLabel: "кино · технологии",
    textureAlt: "Фрагмент жёлто-фиолетовой фактуры картины Whispers of Dawn",
    collectionLabel: "КОЛЛЕКЦИЯ 2026",
    collectionTitle: "Оригинальные картины маслом",
    collectionIntro:
      "Ищите по названию, номеру или SKU и фильтруйте живой каталог по материалу, размеру, цене и доступности.",
    searchLabel: "Поиск по каталогу",
    searchPlaceholder: "Название, номер или SKU",
    material: "Материал",
    allMaterials: "Все",
    canvas: "Холст",
    board: "Холст на картоне",
    size: "Размер",
    allSizes: "Все",
    price: "Цена",
    allPrices: "Все",
    upTo130: "До €130",
    upTo150: "До €150",
    above150: "Выше €150",
    status: "Статус",
    allStatuses: "Все",
    statusAvailable: "В продаже",
    statusReview: "На проверке",
    sort: "Сортировка",
    curated: "Выбор редакции",
    numberAsc: "№: по возрастанию",
    numberDesc: "№: по убыванию",
    priceAsc: "Цена: сначала ниже",
    priceDesc: "Цена: сначала выше",
    results: "работ найдено",
    clear: "Сбросить фильтры",
    loadMore: "Показать ещё",
    noResults: "По этим фильтрам работ не найдено.",
    details: "О работе",
    close: "Закрыть",
    previousImage: "Предыдущее изображение",
    nextImage: "Следующее изображение",
    image: "Изображение",
    of: "из",
    dimensions: "Размер",
    location: "Создано в",
    sku: "SKU",
    priceLabel: "Цена",
    pending: "Требует подтверждения",
    enquire: "Узнать о покупке",
    previousWork: "Предыдущая работа",
    nextWork: "Следующая работа",
    contactTitle: "Для выставок, сотрудничества и вопросов о работах",
    archiveNote:
      "Живопись, путешествия и человеческие связи — живой архив украинского художника Jan Tar.",
    rights: "Все права защищены.",
  },
};

function initialLanguage() {
  if (typeof window === "undefined") return "ru";

  try {
    const saved = window.localStorage.getItem("jan-tar-language");
    if (saved === "ru" || saved === "en") return saved;
  } catch {
    // Continue with the browser language when storage is unavailable.
  }

  return navigator.language?.toLowerCase().startsWith("ru") ? "ru" : "en";
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  const clean = pathname.replace(/\/+$/, "");
  return clean || "/";
}

function useSiteRoute() {
  const [path, setPath] = useState(() =>
    typeof window === "undefined" ? "/" : normalizePath(window.location.pathname),
  );

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((to) => {
    const next = normalizePath(to);
    if (next === normalizePath(window.location.pathname)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return { path, navigate };
}

function SiteLink({ to, navigate, onClick, children, ...props }) {
  return (
    <a
      {...props}
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

function formatPrice(price, language) {
  if (!price) return copy[language].pending;
  return new Intl.NumberFormat(language === "ru" ? "ru-RU" : "en-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function priceMatches(work, filter) {
  if (filter === "all") return true;
  if (!work.price) return false;
  if (filter === "up130") return work.price <= 130;
  if (filter === "up150") return work.price <= 150;
  return work.price > 150;
}

function ArtworkCard({ work, language, onOpen, variant, eager }) {
  const t = copy[language];
  const description = work.description[language] || work.description.en;
  const className = "art-card" + (variant === "feature" ? " art-card--feature" : "");

  return (
    <button
      className={className}
      type="button"
      data-artwork-number={work.number}
      onClick={() => onOpen(work.number)}
      aria-label={work.displayTitle + ". " + description}
    >
      <span className="art-card__image-wrap">
        <img
          src={work.cover}
          alt={work.displayTitle}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
        />
      </span>
      <span className="art-card__body">
        <span className="art-card__heading">
          <span>
            <span className="art-card__number">#{work.number}</span>
            <span className="art-card__title">{work.title}</span>
          </span>
          <span className="art-card__price">{formatPrice(work.price, language)}</span>
        </span>
        <span className="art-card__meta">
          <span>{work.size === "—" ? t.pending : work.size}</span>
          <span>{work.material[language] || work.material.en}</span>
        </span>
        <span className={"art-card__status art-card__status--" + work.status}>
          {work.status === "available" ? t.statusAvailable : t.statusReview}
        </span>
      </span>
    </button>
  );
}

function ArtworkDialog({ work, works, language, onClose, onSelectWork }) {
  const t = copy[language];
  const [imageIndex, setImageIndex] = useState(0);
  const closeRef = useRef(null);
  const workIndex = works.findIndex((item) => item.number === work.number);

  useEffect(() => {
    setImageIndex(0);
    closeRef.current?.focus();
  }, [work.number]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        setImageIndex((current) => (current - 1 + work.images.length) % work.images.length);
      }
      if (event.key === "ArrowRight") {
        setImageIndex((current) => (current + 1) % work.images.length);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [onClose, work.images.length]);

  const selectAdjacentWork = (direction) => {
    const nextIndex = (workIndex + direction + works.length) % works.length;
    onSelectWork(works[nextIndex].number);
  };

  const description = work.description[language] || work.description.en;
  const material = work.material[language] || work.material.en;
  const subject = encodeURIComponent("Jan Tar artwork inquiry: #" + work.number + " " + work.title);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="art-dialog"
        data-testid="artwork-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <header className="art-dialog__header">
          <span className="section-label">{t.details}</span>
          <button
            ref={closeRef}
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label={t.close}
          >
            <X size={21} weight="regular" aria-hidden="true" />
          </button>
        </header>

        <div className="art-dialog__layout">
          <div className="art-dialog__visual">
            <div className="art-dialog__stage">
              <img
                src={work.images[imageIndex]}
                alt={
                  work.displayTitle +
                  ". " +
                  t.image +
                  " " +
                  (imageIndex + 1) +
                  " " +
                  t.of +
                  " " +
                  work.images.length
                }
              />
            </div>

            <div
              className="image-controls"
              aria-label={t.image + " " + (imageIndex + 1) + " " + t.of + " " + work.images.length}
            >
              <button
                type="button"
                onClick={() =>
                  setImageIndex((imageIndex - 1 + work.images.length) % work.images.length)
                }
                aria-label={t.previousImage}
              >
                <ArrowLeft size={19} aria-hidden="true" />
              </button>
              <span>{imageIndex + 1} / {work.images.length}</span>
              <button
                type="button"
                onClick={() => setImageIndex((imageIndex + 1) % work.images.length)}
                aria-label={t.nextImage}
              >
                <ArrowRight size={19} aria-hidden="true" />
              </button>
            </div>

            {work.images.length > 1 && (
              <div className="thumbnail-row">
                {work.images.map((image, index) => (
                  <button
                    className={index === imageIndex ? "is-current" : ""}
                    type="button"
                    key={image}
                    onClick={() => setImageIndex(index)}
                    aria-label={t.image + " " + (index + 1)}
                    aria-pressed={index === imageIndex}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="art-dialog__info">
            <div className="dialog-title-row">
              <span className="dialog-number">#{work.number}</span>
              <span className={"art-card__status art-card__status--" + work.status}>
                {work.status === "available" ? t.statusAvailable : t.statusReview}
              </span>
            </div>
            <h2 id="dialog-title">{work.title}</h2>
            <p className="dialog-description">{description}</p>

            <dl className="spec-list">
              <div><dt>{t.dimensions}</dt><dd>{work.size === "—" ? t.pending : work.size}</dd></div>
              <div><dt>{t.material}</dt><dd>{material}</dd></div>
              <div><dt>{t.priceLabel}</dt><dd>{formatPrice(work.price, language)}</dd></div>
              <div><dt>{t.location}</dt><dd>{work.location}</dd></div>
              <div><dt>{t.sku}</dt><dd>{work.sku}</dd></div>
            </dl>

            <a
              className="primary-link primary-link--wide"
              href={"mailto:oosv@protonmail.com?subject=" + subject}
            >
              {t.enquire}
            </a>

            <div className="work-navigation">
              <button type="button" onClick={() => selectAdjacentWork(-1)}>
                <ArrowLeft size={17} aria-hidden="true" />
                {t.previousWork}
              </button>
              <button type="button" onClick={() => selectAdjacentWork(1)}>
                {t.nextWork}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SiteHeader({ language, setLanguage, path, navigate }) {
  const navigation = siteContent[language].navigation;
  const navItems = [
    ["/works", navigation.works],
    ["/about", navigation.about],
    ["/projects", navigation.projects],
    ["/contact", navigation.contact],
  ];

  return (
    <header className="site-header">
      <SiteLink className="brand" to="/" navigate={navigate} aria-label="Jan Tar Art">
        Jan Tar Art
      </SiteLink>
      <nav className="primary-nav" aria-label={language === "ru" ? "Навигация" : "Primary navigation"}>
        {navItems.map(([to, label]) => {
          const active = path === to || (to === "/projects" && path.startsWith("/projects/"));
          return (
            <SiteLink
              className={active ? "is-active" : ""}
              aria-current={active ? "page" : undefined}
              key={to}
              to={to}
              navigate={navigate}
            >
              {label}
            </SiteLink>
          );
        })}
      </nav>
      <div className="language-switch" aria-label={language === "ru" ? "Язык" : "Language"}>
        <button
          className={language === "ru" ? "is-active" : ""}
          type="button"
          onClick={() => setLanguage("ru")}
          aria-pressed={language === "ru"}
        >
          RU
        </button>
        <span aria-hidden="true">/</span>
        <button
          className={language === "en" ? "is-active" : ""}
          type="button"
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
        >
          EN
        </button>
      </div>
    </header>
  );
}

function SiteFooter({ language, navigate }) {
  const t = copy[language];
  const navigation = siteContent[language].navigation;

  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <strong>Jan Tar Art</strong>
        <p>{t.archiveNote}</p>
        <nav className="footer-nav" aria-label={language === "ru" ? "Навигация в подвале" : "Footer navigation"}>
          <SiteLink to="/works" navigate={navigate}>{navigation.works}</SiteLink>
          <SiteLink to="/about" navigate={navigate}>{navigation.about}</SiteLink>
          <SiteLink to="/projects" navigate={navigate}>{navigation.projects}</SiteLink>
        </nav>
      </div>
      <div className="site-footer__contact">
        <p className="section-label">{navigation.contact}</p>
        <h2>{t.contactTitle}</h2>
        <a href="mailto:oosv@protonmail.com">oosv@protonmail.com</a>
        <a href="https://t.me/JanTarX">Telegram @JanTarX</a>
      </div>
      <small>© 2026 Jan Tar. {t.rights}</small>
    </footer>
  );
}

function Hero({ language, navigate, availableCount }) {
  const t = copy[language];

  return (
    <section className="hero" aria-labelledby="page-title">
      <div className="hero__copy">
        <p className="section-label">{t.artistLine}</p>
        <h1 id="page-title">
          {t.heroTitle.map((line) => <span key={line}>{line}</span>)}
        </h1>
        <p className="hero__intro">{t.heroIntro}</p>
        <div className="hero__actions">
          <SiteLink className="primary-link" to="/works" navigate={navigate}>{t.browse}</SiteLink>
          <SiteLink className="text-link" to="/about" navigate={navigate}>{t.story}</SiteLink>
        </div>
        <div className="hero__stats" aria-label={language === "ru" ? "Кратко о сайте" : "Site summary"}>
          <span><strong>{catalog.length}</strong><small>{t.works}</small></span>
          <span><strong>{availableCount}</strong><small>{t.available}</small></span>
          <span><strong>2</strong><small>{t.projects}</small></span>
        </div>
      </div>

      <figure className="hero__art" aria-label={t.heroArtAlt}>
        <img className="hero-art hero-art--tall" src="/art/long-hush.jpg" alt={t.longHushAlt} fetchPriority="high" />
        <img className="hero-art hero-art--blue" src="/art/blue-square.jpg" alt={t.silentDriftAlt} fetchPriority="high" />
        <img className="hero-art hero-art--yellow" src="/art/yellow-violet.jpg" alt={t.whispersAlt} fetchPriority="high" />
        <img className="hero-art hero-art--orange" src="/art/orange-square.jpg" alt={t.echoAlt} fetchPriority="high" />
      </figure>
    </section>
  );
}

function HomePage({ language, navigate, onOpenWork, availableCount }) {
  const t = copy[language];
  const content = siteContent[language];
  const featuredWorks = FEATURED_ORDER.map((number) => catalog.find((work) => work.number === number));
  const facts = [
    { Icon: PaintBrush, value: t.factWorksValue, label: t.factWorksLabel },
    { Icon: GlobeHemisphereWest, value: t.factPlaceValue, label: t.factPlaceLabel },
    { Icon: UsersThree, value: t.factPracticeValue, label: t.factPracticeLabel },
  ];

  return (
    <main>
      <Hero language={language} navigate={navigate} availableCount={availableCount} />

      <section className="home-featured page-section" aria-labelledby="featured-title">
        <div className="page-section__heading">
          <div>
            <p className="section-label">{content.home.featuredLabel}</p>
            <h2 id="featured-title">{content.home.featuredTitle}</h2>
          </div>
          <p>{content.home.featuredBody}</p>
        </div>
        <div className="home-art-grid">
          {featuredWorks.map((work, index) => (
            <ArtworkCard
              key={work.number}
              work={work}
              language={language}
              onOpen={onOpenWork}
              variant="standard"
              eager={index < 2}
            />
          ))}
        </div>
        <SiteLink className="section-link" to="/works" navigate={navigate}>
          {content.home.allWorks}
          <ArrowRight size={18} aria-hidden="true" />
        </SiteLink>
      </section>

      <section className="about about--preview" aria-labelledby="about-preview-title">
        <div className="about__copy">
          <p className="section-label">{t.aboutLabel}</p>
          <h2 id="about-preview-title">{t.aboutTitle}</h2>
          <p>{t.aboutBody}</p>
          <div className="about__facts">
            {facts.map(({ Icon, value, label }) => (
              <div className="about-fact" key={label}>
                <Icon size={25} weight="light" aria-hidden="true" />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <SiteLink className="section-link" to="/about" navigate={navigate}>
            {content.home.aboutLink}
            <ArrowRight size={18} aria-hidden="true" />
          </SiteLink>
        </div>
        <div className="about__image">
          <img src="/art/yellow-violet-detail.jpg" alt={t.textureAlt} loading="lazy" decoding="async" />
        </div>
      </section>

      <section className="project-teasers page-section" aria-labelledby="project-teasers-title">
        <div className="page-section__heading">
          <div>
            <p className="section-label">{content.home.projectLabel}</p>
            <h2 id="project-teasers-title">{content.home.projectTitle}</h2>
          </div>
          <SiteLink className="section-link section-link--top" to="/projects" navigate={navigate}>
            {content.home.projectsLink}
            <ArrowRight size={18} aria-hidden="true" />
          </SiteLink>
        </div>
        <div className="project-card-grid">
          <ProjectCard
            project={content.projects.human}
            to="/projects/human-trust"
            image="/art/long-hush.jpg"
            imageAlt={t.longHushAlt}
            language={language}
            navigate={navigate}
          />
          <ProjectCard
            project={content.projects.archive}
            to="/projects/archive-of-passing"
            image="/art/blue-square.jpg"
            imageAlt={t.silentDriftAlt}
            language={language}
            navigate={navigate}
          />
        </div>
      </section>
    </main>
  );
}

function CatalogPage({
  language,
  query,
  setQuery,
  material,
  setMaterial,
  size,
  setSize,
  price,
  setPrice,
  status,
  setStatus,
  sort,
  setSort,
  visibleCount,
  setVisibleCount,
  sizes,
  filteredWorks,
  clearFilters,
  onOpenWork,
}) {
  const t = copy[language];
  const hasFilters =
    query || material !== "all" || size !== "all" || price !== "all" || status !== "all";
  const curatedLayout = sort === "curated" && !hasFilters;

  return (
    <main>
      <section className="page-masthead page-masthead--works" aria-labelledby="works-page-title">
        <div>
          <p className="section-label">{t.collectionLabel}</p>
          <h1 id="works-page-title">{t.collectionTitle}</h1>
        </div>
        <p>{t.collectionIntro}</p>
      </section>

      <section className="collection collection--page" aria-label={t.collectionTitle}>
        <div className="collection__heading collection__heading--compact">
          <p className="result-count" aria-live="polite">
            <strong>{filteredWorks.length}</strong> {t.results}
          </p>
        </div>

        <form className="filters" onSubmit={(event) => event.preventDefault()}>
          <label className="search-field">
            <span className="visually-hidden">{t.searchLabel}</span>
            <MagnifyingGlass size={19} weight="regular" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchPlaceholder}
            />
          </label>

          <label>
            <span>{t.material}</span>
            <select value={material} onChange={(event) => setMaterial(event.target.value)}>
              <option value="all">{t.allMaterials}</option>
              <option value="canvas">{t.canvas}</option>
              <option value="board">{t.board}</option>
            </select>
          </label>

          <label>
            <span>{t.size}</span>
            <select value={size} onChange={(event) => setSize(event.target.value)}>
              <option value="all">{t.allSizes}</option>
              {sizes.map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
          </label>

          <label>
            <span>{t.price}</span>
            <select value={price} onChange={(event) => setPrice(event.target.value)}>
              <option value="all">{t.allPrices}</option>
              <option value="up130">{t.upTo130}</option>
              <option value="up150">{t.upTo150}</option>
              <option value="over150">{t.above150}</option>
            </select>
          </label>

          <label>
            <span>{t.status}</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">{t.allStatuses}</option>
              <option value="available">{t.statusAvailable}</option>
              <option value="review">{t.statusReview}</option>
            </select>
          </label>

          <label>
            <span>{t.sort}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="curated">{t.curated}</option>
              <option value="number-asc">{t.numberAsc}</option>
              <option value="number-desc">{t.numberDesc}</option>
              <option value="price-asc">{t.priceAsc}</option>
              <option value="price-desc">{t.priceDesc}</option>
            </select>
          </label>
        </form>

        {hasFilters && (
          <button className="clear-button" type="button" onClick={clearFilters}>
            {t.clear}
          </button>
        )}

        {filteredWorks.length ? (
          <>
            <div className="art-grid">
              {filteredWorks.slice(0, visibleCount).map((work, index) => (
                <ArtworkCard
                  key={work.number}
                  work={work}
                  language={language}
                  onOpen={onOpenWork}
                  variant={curatedLayout && index === 3 ? "feature" : "standard"}
                  eager={index < 4}
                />
              ))}
            </div>

            {visibleCount < filteredWorks.length && (
              <div className="load-more-wrap">
                <button
                  type="button"
                  className="load-more"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                >
                  <span>{t.loadMore}</span>
                  <small>{Math.min(visibleCount, filteredWorks.length)} / {filteredWorks.length}</small>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>{t.noResults}</p>
            <button type="button" onClick={clearFilters}>{t.clear}</button>
          </div>
        )}
      </section>
    </main>
  );
}

function AboutPage({ language, navigate }) {
  const content = siteContent[language];
  const t = copy[language];

  return (
    <main>
      <section className="story-hero" aria-labelledby="about-page-title">
        <div className="story-hero__copy">
          <p className="section-label">{content.about.label}</p>
          <h1 id="about-page-title">{content.about.title}</h1>
          <p className="story-hero__lead">{content.about.lead}</p>
          <p>{content.about.intro}</p>
        </div>
        <figure className="story-hero__image">
          <img src="/art/yellow-violet-detail.jpg" alt={t.textureAlt} fetchPriority="high" />
        </figure>
      </section>

      <section className="story-sections" aria-label={content.about.label}>
        {content.about.sections.map((section, index) => (
          <article className="story-section" key={section.number}>
            <div className="story-section__heading">
              <span>{section.number}</span>
              <h2>{section.title}</h2>
            </div>
            <div className="story-section__body">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {index === 0 && (
              <figure className="story-section__art story-section__art--blue">
                <img src="/art/blue-square.jpg" alt={t.silentDriftAlt} loading="lazy" />
              </figure>
            )}
            {index === 2 && (
              <figure className="story-section__art story-section__art--orange">
                <img src="/art/orange-square.jpg" alt={t.echoAlt} loading="lazy" />
              </figure>
            )}
          </article>
        ))}
      </section>

      <section className="editorial-quote" aria-label={language === "ru" ? "Высказывание художника" : "Artist statement"}>
        <blockquote>{content.about.quote}</blockquote>
        <p>{content.about.closing}</p>
        <div className="editorial-quote__actions">
          <SiteLink className="primary-link" to="/works" navigate={navigate}>{content.about.worksCta}</SiteLink>
          <SiteLink className="text-link" to="/projects" navigate={navigate}>{content.about.projectsCta}</SiteLink>
        </div>
      </section>
    </main>
  );
}

function ProjectCard({ project, to, image, imageAlt, language, navigate }) {
  return (
    <SiteLink className="project-card" to={to} navigate={navigate}>
      <span className="project-card__image">
        <img src={image} alt={imageAlt} loading="lazy" />
      </span>
      <span className="project-card__body">
        <span className="section-label">{project.eyebrow}</span>
        <strong>{project.title}</strong>
        <span>{project.short}</span>
        <span className="project-card__link">
          {siteContent[language].projects.openProject}
          <ArrowUpRight size={18} aria-hidden="true" />
        </span>
      </span>
    </SiteLink>
  );
}

function ProjectsPage({ language, navigate }) {
  const content = siteContent[language];
  const t = copy[language];

  return (
    <main>
      <section className="page-masthead page-masthead--projects" aria-labelledby="projects-page-title">
        <div>
          <p className="section-label">{content.projects.label}</p>
          <h1 id="projects-page-title">{content.projects.title}</h1>
        </div>
        <p>{content.projects.lead}</p>
      </section>
      <section className="projects-index" aria-label={content.projects.label}>
        <ProjectCard
          project={content.projects.human}
          to="/projects/human-trust"
          image="/art/long-hush.jpg"
          imageAlt={t.longHushAlt}
          language={language}
          navigate={navigate}
        />
        <ProjectCard
          project={content.projects.archive}
          to="/projects/archive-of-passing"
          image="/art/blue-square.jpg"
          imageAlt={t.silentDriftAlt}
          language={language}
          navigate={navigate}
        />
      </section>
    </main>
  );
}

function ProjectDetailPage({ language, navigate, projectKey }) {
  const content = siteContent[language];
  const t = copy[language];
  const isHuman = projectKey === "human";
  const project = content.projects[projectKey];
  const heroImage = isHuman ? "/art/long-hush.jpg" : "/art/blue-square.jpg";
  const heroAlt = isHuman ? t.longHushAlt : t.silentDriftAlt;
  const secondaryImage = isHuman ? "/art/orange-square.jpg" : "/art/yellow-violet.jpg";
  const secondaryAlt = isHuman ? t.echoAlt : t.whispersAlt;

  return (
    <main>
      <article className="project-detail">
        <div className="project-detail__topline">
          <SiteLink className="back-link" to="/projects" navigate={navigate}>
            <ArrowLeft size={17} aria-hidden="true" />
            {content.projects.back}
          </SiteLink>
        </div>
        <header className="project-detail__hero">
          <div className="project-detail__title">
            <p className="section-label">{project.eyebrow}</p>
            <h1>{project.title}</h1>
            <p>{project.intro}</p>
          </div>
          <figure>
            <img src={heroImage} alt={heroAlt} fetchPriority="high" />
          </figure>
        </header>
        <div className="project-detail__story">
          <div className="project-detail__copy">
            {project.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <figure className="project-detail__secondary-art">
            <img src={secondaryImage} alt={secondaryAlt} loading="lazy" />
          </figure>
        </div>
        <blockquote className="project-detail__quote">{project.quote}</blockquote>
      </article>
    </main>
  );
}

function ContactPage({ language }) {
  const content = siteContent[language].contact;
  const t = copy[language];
  const subjects = [
    [content.artwork, content.artworkText],
    [content.exhibition, content.exhibitionText],
    [content.collaboration, content.collaborationText],
  ];

  return (
    <main>
      <section className="contact-page" aria-labelledby="contact-page-title">
        <div className="contact-page__intro">
          <p className="section-label">{content.label}</p>
          <h1 id="contact-page-title">{content.title}</h1>
          <p>{content.lead}</p>
          <div className="contact-page__links">
            <a className="primary-link" href="mailto:oosv@protonmail.com">oosv@protonmail.com</a>
            <a className="text-link" href="https://t.me/JanTarX">Telegram @JanTarX</a>
          </div>
        </div>
        <figure className="contact-page__image">
          <img src="/art/orange-square.jpg" alt={t.echoAlt} fetchPriority="high" />
        </figure>
        <div className="contact-page__subjects">
          {subjects.map(([title, body], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="contact-page__location">
          <p className="section-label">{content.locationLabel}</p>
          <p>{content.location}</p>
        </div>
      </section>
    </main>
  );
}

function NotFoundPage({ language, navigate }) {
  const content = siteContent[language].common;

  return (
    <main className="not-found">
      <p className="section-label">{content.notFoundLabel}</p>
      <h1>{content.notFoundTitle}</h1>
      <p>{content.notFoundBody}</p>
      <SiteLink className="primary-link" to="/" navigate={navigate}>{content.backHome}</SiteLink>
    </main>
  );
}

export function App() {
  const { path, navigate } = useSiteRoute();
  const [language, setLanguage] = useState(initialLanguage);
  const [query, setQuery] = useState("");
  const [material, setMaterial] = useState("all");
  const [size, setSize] = useState("all");
  const [price, setPrice] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("curated");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedNumber, setSelectedNumber] = useState(null);

  const sizes = useMemo(() => {
    return [...new Set(catalog.map((work) => work.size).filter((value) => value !== "—"))]
      .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10) || a.localeCompare(b));
  }, []);

  const filteredWorks = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(language === "ru" ? "ru" : "en");
    const result = catalog.filter((work) => {
      const haystack = [
        work.number,
        work.title,
        work.sku,
        work.description.en,
        work.description.ru,
      ].join(" ").toLocaleLowerCase(language === "ru" ? "ru" : "en");

      return (
        (!needle || haystack.includes(needle)) &&
        (material === "all" || work.material.kind === material) &&
        (size === "all" || work.size === size) &&
        priceMatches(work, price) &&
        (status === "all" || work.status === status)
      );
    });

    return result.sort((a, b) => {
      if (sort === "curated") {
        const aRank = FEATURED_RANK.has(a.number) ? FEATURED_RANK.get(a.number) : Number.POSITIVE_INFINITY;
        const bRank = FEATURED_RANK.has(b.number) ? FEATURED_RANK.get(b.number) : Number.POSITIVE_INFINITY;
        return aRank - bRank || a.number - b.number;
      }
      if (sort === "number-desc") return b.number - a.number;
      if (sort === "price-asc") {
        return (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY);
      }
      if (sort === "price-desc") {
        return (b.price ?? Number.NEGATIVE_INFINITY) - (a.price ?? Number.NEGATIVE_INFINITY);
      }
      return a.number - b.number;
    });
  }, [language, material, price, query, size, sort, status]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [material, price, query, size, sort, status]);

  useEffect(() => {
    setSelectedNumber(null);
  }, [path]);

  useEffect(() => {
    document.documentElement.lang = language;
    const meta = routeMetadata[language][path] || routeMetadata[language]["/"];
    document.title = meta.title;

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.description);

    const canonicalUrl = window.location.origin + (PUBLIC_ROUTES.has(path) ? path : "/");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.append(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.append(ogUrl);
    }
    ogUrl.setAttribute("content", canonicalUrl);

    try {
      window.localStorage.setItem("jan-tar-language", language);
    } catch {
      // The site remains fully usable when storage is unavailable.
    }
  }, [language, path]);

  useEffect(() => {
    if (selectedNumber && !catalog.some((work) => work.number === selectedNumber)) {
      setSelectedNumber(null);
    }
  }, [selectedNumber]);

  const clearFilters = () => {
    setQuery("");
    setMaterial("all");
    setSize("all");
    setPrice("all");
    setStatus("all");
  };

  const availableCount = catalog.filter((work) => work.status === "available").length;
  const selectedWork = selectedNumber
    ? catalog.find((work) => work.number === selectedNumber)
    : null;
  const dialogWorks = path === "/works" ? filteredWorks : catalog;

  let page;
  if (path === "/") {
    page = (
      <HomePage
        language={language}
        navigate={navigate}
        onOpenWork={setSelectedNumber}
        availableCount={availableCount}
      />
    );
  } else if (path === "/works") {
    page = (
      <CatalogPage
        language={language}
        query={query}
        setQuery={setQuery}
        material={material}
        setMaterial={setMaterial}
        size={size}
        setSize={setSize}
        price={price}
        setPrice={setPrice}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
        visibleCount={visibleCount}
        setVisibleCount={setVisibleCount}
        sizes={sizes}
        filteredWorks={filteredWorks}
        clearFilters={clearFilters}
        onOpenWork={setSelectedNumber}
      />
    );
  } else if (path === "/about") {
    page = <AboutPage language={language} navigate={navigate} />;
  } else if (path === "/projects") {
    page = <ProjectsPage language={language} navigate={navigate} />;
  } else if (path === "/projects/human-trust") {
    page = <ProjectDetailPage language={language} navigate={navigate} projectKey="human" />;
  } else if (path === "/projects/archive-of-passing") {
    page = <ProjectDetailPage language={language} navigate={navigate} projectKey="archive" />;
  } else if (path === "/contact") {
    page = <ContactPage language={language} />;
  } else {
    page = <NotFoundPage language={language} navigate={navigate} />;
  }

  return (
    <div className="site-shell">
      <SiteHeader
        language={language}
        setLanguage={setLanguage}
        path={path}
        navigate={navigate}
      />
      {page}
      <SiteFooter language={language} navigate={navigate} />

      {selectedWork && (
        <ArtworkDialog
          work={selectedWork}
          works={dialogWorks}
          language={language}
          onClose={() => setSelectedNumber(null)}
          onSelectWork={setSelectedNumber}
        />
      )}
    </div>
  );
}
