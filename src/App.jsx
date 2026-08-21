import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  PaintBrush,
  GlobeHemisphereWest,
  MagnifyingGlass,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import catalog from "./data/catalog.json";

const PAGE_SIZE = 18;
const FEATURED_ORDER = [100, 150, 182, 227];
const FEATURED_RANK = new Map(FEATURED_ORDER.map((number, index) => [number, index]));

const copy = {
  en: {
    worksNav: "Works",
    aboutNav: "About the artist",
    contactNav: "Contact",
    artistLine: "OIL PAINTING · LIMBURG, NETHERLANDS",
    heroTitle: ["Colour,", "texture,", "memory"],
    heroIntro:
      "Oil paintings built from movement, touch and the quiet persistence of colour.",
    browse: "View works",
    story: "Read the story",
    works: "works",
    available: "available",
    review: "record to verify",
    heroArtAlt: "A studio arrangement of four oil paintings by Jan Tar",
    longHushAlt: "Long Hush, a tall peach and earth-toned oil painting",
    silentDriftAlt: "Silent Drift, a blue oil painting on an easel",
    whispersAlt: "Whispers of Dawn, a yellow and violet oil painting on an easel",
    echoAlt: "Ebullient Echo, an orange oil painting on an easel",
    aboutLabel: "ABOUT THE ARTIST",
    aboutTitle:
      "Jan Tar is a Ukrainian artist, musician and cultural organiser working in the Netherlands.",
    aboutBody:
      "His painting practice speaks about displacement, resilience and community. Jan also creates musical gatherings and community projects; in 2024 he founded the KSA social initiative.",
    aboutBodySecond:
      "Alongside painting, Jan creates musical gatherings and community projects. In 2024 he founded the KSA social initiative, bringing creative practices into shared spaces.",
    factWorksValue: "200+",
    factWorksLabel: "oil paintings",
    factPlaceValue: "since 2022",
    factPlaceLabel: "in the Netherlands",
    factPracticeValue: "painting · music",
    factPracticeLabel: "community projects",
    textureAlt: "Close-up of yellow and violet impasto from Whispers of Dawn",
    collectionLabel: "COLLECTION 2026",
    collectionTitle: "Original oil paintings",
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
      "A living catalogue of original oil paintings created in Limburg, the Netherlands.",
    rights: "All rights reserved.",
  },
  ru: {
    worksNav: "Работы",
    aboutNav: "О художнике",
    contactNav: "Контакты",
    artistLine: "МАСЛЯНАЯ ЖИВОПИСЬ · ЛИМБУРГ, НИДЕРЛАНДЫ",
    heroTitle: ["Цвет,", "фактура,", "память"],
    heroIntro:
      "Живопись маслом, построенная на движении, прикосновении и тихой силе цвета.",
    browse: "Смотреть работы",
    story: "Читать историю",
    works: "работ",
    available: "в продаже",
    review: "карточка на проверке",
    heroArtAlt: "Студийная композиция из четырёх картин Яна Тара",
    longHushAlt: "Long Hush — высокая картина в персиковых и земляных тонах",
    silentDriftAlt: "Silent Drift — голубая картина маслом на мольберте",
    whispersAlt: "Whispers of Dawn — жёлто-фиолетовая картина на мольберте",
    echoAlt: "Ebullient Echo — оранжевая картина на мольберте",
    aboutLabel: "О ХУДОЖНИКЕ",
    aboutTitle:
      "Ян Тар — украинский художник, музыкант и культурный организатор, работающий в Нидерландах.",
    aboutBody:
      "В его практике живопись становится способом говорить о перемещении, устойчивости и сообществе. Ян также создаёт музыкальные встречи и общественные проекты; в 2024 году он основал социальную инициативу KSA.",
    aboutBodySecond:
      "Помимо живописи, Ян создаёт музыкальные встречи и общественные проекты. В 2024 году он основал социальную инициативу KSA, соединяющую творческие практики и людей.",
    factWorksValue: "200+",
    factWorksLabel: "картин маслом",
    factPlaceValue: "с 2022 года",
    factPlaceLabel: "в Нидерландах",
    factPracticeValue: "живопись · музыка",
    factPracticeLabel: "общественные проекты",
    textureAlt: "Фрагмент жёлто-фиолетовой фактуры картины Whispers of Dawn",
    collectionLabel: "КОЛЛЕКЦИЯ 2026",
    collectionTitle: "Оригинальные картины маслом",
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
      "Живой каталог оригинальной живописи маслом, созданной в Лимбурге, Нидерланды.",
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

export function App() {
  const [language, setLanguage] = useState(initialLanguage);
  const [query, setQuery] = useState("");
  const [material, setMaterial] = useState("all");
  const [size, setSize] = useState("all");
  const [price, setPrice] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("curated");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      language === "ru"
        ? "Ян Тар — художник и каталог живописи маслом"
        : "Jan Tar — Artist and Oil Painting Catalogue";

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", t.archiveNote);

    try {
      window.localStorage.setItem("jan-tar-language", language);
    } catch {
      // The site remains fully usable when storage is unavailable.
    }
  }, [language, t.archiveNote]);

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
    if (selectedNumber && !filteredWorks.some((work) => work.number === selectedNumber)) {
      setSelectedNumber(null);
    }
  }, [filteredWorks, selectedNumber]);

  const selectedWork = selectedNumber
    ? filteredWorks.find((work) => work.number === selectedNumber)
    : null;
  const hasFilters =
    query || material !== "all" || size !== "all" || price !== "all" || status !== "all";
  const curatedLayout = sort === "curated" && !hasFilters;
  const availableCount = catalog.filter((work) => work.status === "available").length;
  const reviewCount = catalog.filter((work) => work.status === "review").length;

  const clearFilters = () => {
    setQuery("");
    setMaterial("all");
    setSize("all");
    setPrice("all");
    setStatus("all");
  };

  const aboutFacts = [
    { Icon: PaintBrush, value: t.factWorksValue, label: t.factWorksLabel },
    { Icon: GlobeHemisphereWest, value: t.factPlaceValue, label: t.factPlaceLabel },
    { Icon: UsersThree, value: t.factPracticeValue, label: t.factPracticeLabel },
  ];

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Jan Tar Art">
          Jan Tar Art
        </a>
        <nav className="primary-nav" aria-label={language === "ru" ? "Навигация" : "Primary navigation"}>
          <a href="#collection">{t.worksNav}</a>
          <a href="#about">{t.aboutNav}</a>
          <a href="#contact">{t.contactNav}</a>
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

      <main id="top">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero__copy">
            <p className="section-label">{t.artistLine}</p>
            <h1 id="page-title">
              {t.heroTitle.map((line) => <span key={line}>{line}</span>)}
            </h1>
            <div className="hero__actions">
              <a className="primary-link" href="#collection">{t.browse}</a>
              <a className="text-link" href="#about">{t.story}</a>
            </div>
            <div className="hero__stats" aria-label={language === "ru" ? "Каталог" : "Catalogue summary"}>
              <span><strong>{catalog.length}</strong><small>{t.works}</small></span>
              <span><strong>{availableCount}</strong><small>{t.available}</small></span>
              <span><strong>{reviewCount}</strong><small>{t.review}</small></span>
            </div>
          </div>

          <figure className="hero__art" aria-label={t.heroArtAlt}>
            <img className="hero-art hero-art--tall" src="/art/long-hush.jpg" alt={t.longHushAlt} fetchPriority="high" />
            <img className="hero-art hero-art--blue" src="/art/blue-square.jpg" alt={t.silentDriftAlt} fetchPriority="high" />
            <img className="hero-art hero-art--yellow" src="/art/yellow-violet.jpg" alt={t.whispersAlt} fetchPriority="high" />
            <img className="hero-art hero-art--orange" src="/art/orange-square.jpg" alt={t.echoAlt} fetchPriority="high" />
          </figure>
        </section>

        <section className="about" id="about" aria-labelledby="about-title">
          <div className="about__copy">
            <p className="section-label">{t.aboutLabel}</p>
            <h2 id="about-title">{t.aboutTitle}</h2>
            <p>{t.aboutBody}</p>
            <div className="about__facts">
              {aboutFacts.map(({ Icon, value, label }) => (
                <div className="about-fact" key={label}>
                  <Icon size={25} weight="light" aria-hidden="true" />
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="about__image">
            <img src="/art/yellow-violet-detail.jpg" alt={t.textureAlt} loading="lazy" decoding="async" />
          </div>
        </section>

        <section className="collection" id="collection" aria-labelledby="collection-title">
          <div className="collection__heading">
            <div>
              <p className="section-label">{t.collectionLabel}</p>
              <h2 className="visually-hidden" id="collection-title">{t.collectionTitle}</h2>
            </div>
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
                    onOpen={setSelectedNumber}
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

      <footer className="site-footer" id="contact">
        <div className="site-footer__brand">
          <strong>Jan Tar Art</strong>
          <p>{t.archiveNote}</p>
        </div>
        <div className="site-footer__contact">
          <p className="section-label">{t.contactNav}</p>
          <h2>{t.contactTitle}</h2>
          <a href="mailto:oosv@protonmail.com">oosv@protonmail.com</a>
          <a href="https://t.me/JanTarX">Telegram @JanTarX</a>
        </div>
        <small>© 2026 Jan Tar. {t.rights}</small>
      </footer>

      {selectedWork && (
        <ArtworkDialog
          work={selectedWork}
          works={filteredWorks}
          language={language}
          onClose={() => setSelectedNumber(null)}
          onSelectWork={setSelectedNumber}
        />
      )}
    </div>
  );
}
