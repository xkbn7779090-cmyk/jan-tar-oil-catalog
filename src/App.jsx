import { useEffect, useMemo, useRef, useState } from "react";
import catalog from "./data/catalog.json";

const PAGE_SIZE = 24;

const copy = {
  en: {
    gallery: "Gallery",
    artistLine: "JAN TAR · LIMBURG, NETHERLANDS",
    title: "Oil paintings",
    intro:
      "A living catalog of small-format abstractions, tactile surfaces and quiet shifts of colour.",
    works: "works",
    available: "available",
    review: "record to verify",
    browse: "Browse the collection",
    searchLabel: "Search the catalog",
    searchPlaceholder: "Title, number or SKU",
    material: "Material",
    allMaterials: "All materials",
    canvas: "Canvas",
    board: "Canvas board",
    size: "Size",
    allSizes: "All sizes",
    price: "Price",
    allPrices: "All prices",
    upTo130: "Up to €130",
    upTo150: "Up to €150",
    above150: "Above €150",
    status: "Status",
    allStatuses: "All statuses",
    statusAvailable: "Available",
    statusReview: "Needs review",
    sort: "Sort",
    numberAsc: "No.: low to high",
    numberDesc: "No.: high to low",
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
    archiveNote:
      "Catalog rebuilt from the artist’s Editorial 2026 archive and verified image repository.",
    contact: "Contact",
    rights: "All rights reserved.",
  },
  ru: {
    gallery: "Галерея",
    artistLine: "ЯН ТАР · ЛИМБУРГ, НИДЕРЛАНДЫ",
    title: "Живопись маслом",
    intro:
      "Живой каталог камерных абстракций, фактурных поверхностей и тихих переходов цвета.",
    works: "работ",
    available: "в продаже",
    review: "карточка на проверке",
    browse: "Смотреть коллекцию",
    searchLabel: "Поиск по каталогу",
    searchPlaceholder: "Название, номер или SKU",
    material: "Основа",
    allMaterials: "Все материалы",
    canvas: "Холст",
    board: "Холст на картоне",
    size: "Размер",
    allSizes: "Все размеры",
    price: "Цена",
    allPrices: "Все цены",
    upTo130: "До €130",
    upTo150: "До €150",
    above150: "Выше €150",
    status: "Статус",
    allStatuses: "Все статусы",
    statusAvailable: "В продаже",
    statusReview: "На проверке",
    sort: "Сортировка",
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
    archiveNote:
      "Каталог пересобран по редакционной базе художника 2026 года и проверенному фотоархиву.",
    contact: "Контакты",
    rights: "Все права защищены.",
  },
};

function initialLanguage() {
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("ru")) {
    return "ru";
  }
  return "en";
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

function ArtworkCard({ work, language, onOpen }) {
  const t = copy[language];

  return (
    <button className="art-card" type="button" data-artwork-number={work.number} onClick={() => onOpen(work.number)}>
      <span className="art-card__image-wrap">
        <img src={work.cover} alt={work.displayTitle} loading="lazy" decoding="async" />
        <span className={`status-pill status-pill--${work.status}`}>
          {work.status === "available" ? t.statusAvailable : t.statusReview}
        </span>
      </span>
      <span className="art-card__body">
        <span className="art-card__number">#{work.number}</span>
        <span className="art-card__title">{work.title}</span>
        <span className="art-card__meta">
          <span>{work.size === "—" ? t.pending : work.size}</span>
          <span>{formatPrice(work.price, language)}</span>
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
  const subject = encodeURIComponent(`Jan Tar artwork inquiry: #${work.number} ${work.title}`);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="art-dialog" data-testid="artwork-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <header className="art-dialog__header">
          <span className="eyebrow">{t.details}</span>
          <button ref={closeRef} className="text-button" type="button" onClick={onClose}>
            {t.close}
          </button>
        </header>

        <div className="art-dialog__layout">
          <div className="art-dialog__visual">
            <div className="art-dialog__stage">
              <img
                src={work.images[imageIndex]}
                alt={`${work.displayTitle}. ${t.image} ${imageIndex + 1} ${t.of} ${work.images.length}`}
              />
            </div>

            <div className="image-controls" aria-label={`${t.image} ${imageIndex + 1} ${t.of} ${work.images.length}`}>
              <button type="button" onClick={() => setImageIndex((imageIndex - 1 + work.images.length) % work.images.length)}>
                {t.previousImage}
              </button>
              <span>{imageIndex + 1} / {work.images.length}</span>
              <button type="button" onClick={() => setImageIndex((imageIndex + 1) % work.images.length)}>
                {t.nextImage}
              </button>
            </div>

            <div className="thumbnail-row">
              {work.images.map((image, index) => (
                <button
                  className={index === imageIndex ? "is-current" : ""}
                  type="button"
                  key={image}
                  onClick={() => setImageIndex(index)}
                  aria-label={`${t.image} ${index + 1}`}
                  aria-pressed={index === imageIndex}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="art-dialog__info">
            <div className="dialog-title-row">
              <span className="dialog-number">#{work.number}</span>
              <span className={`status-pill status-pill--${work.status}`}>
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

            <a className="inquiry-link" href={`mailto:oosv@protonmail.com?subject=${subject}`}>
              {t.enquire}
            </a>

            <div className="work-navigation">
              <button type="button" onClick={() => selectAdjacentWork(-1)}>{t.previousWork}</button>
              <button type="button" onClick={() => selectAdjacentWork(1)}>{t.nextWork}</button>
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
  const [sort, setSort] = useState("number-asc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const t = copy[language];

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
      if (sort === "number-desc") return b.number - a.number;
      if (sort === "price-asc") return (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY);
      if (sort === "price-desc") return (b.price ?? Number.NEGATIVE_INFINITY) - (a.price ?? Number.NEGATIVE_INFINITY);
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
  const hasFilters = query || material !== "all" || size !== "all" || price !== "all" || status !== "all";

  const clearFilters = () => {
    setQuery("");
    setMaterial("all");
    setSize("all");
    setPrice("all");
    setStatus("all");
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Jan Tar Art">Jan Tar Art</a>
        <nav aria-label="Primary navigation">
          <a href="#collection">{t.gallery}</a>
          <div className="language-switch" aria-label="Language">
            <button className={language === "en" ? "is-active" : ""} type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"}>EN</button>
            <button className={language === "ru" ? "is-active" : ""} type="button" onClick={() => setLanguage("ru")} aria-pressed={language === "ru"}>RU</button>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="page-title">
          <p className="eyebrow">{t.artistLine}</p>
          <h1 id="page-title">{t.title}</h1>
          <p className="hero__intro">{t.intro}</p>
          <div className="hero__stats" aria-label="Catalog summary">
            <span><strong>{catalog.length}</strong> {t.works}</span>
            <span><strong>{catalog.filter((work) => work.status === "available").length}</strong> {t.available}</span>
            <span><strong>{catalog.filter((work) => work.status === "review").length}</strong> {t.review}</span>
          </div>
        </section>

        <section className="collection" id="collection" aria-labelledby="collection-title">
          <div className="collection__heading">
            <div>
              <p className="eyebrow">EDITORIAL 2026</p>
              <h2 id="collection-title">{t.browse}</h2>
            </div>
            <p className="result-count" aria-live="polite"><strong>{filteredWorks.length}</strong> {t.results}</p>
          </div>

          <form className="filters" onSubmit={(event) => event.preventDefault()}>
            <label className="search-field">
              <span>{t.searchLabel}</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} />
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
                <option value="number-asc">{t.numberAsc}</option>
                <option value="number-desc">{t.numberDesc}</option>
                <option value="price-asc">{t.priceAsc}</option>
                <option value="price-desc">{t.priceDesc}</option>
              </select>
            </label>
          </form>

          {hasFilters && (
            <button className="clear-button" type="button" onClick={clearFilters}>{t.clear}</button>
          )}

          {filteredWorks.length ? (
            <>
              <div className="art-grid">
                {filteredWorks.slice(0, visibleCount).map((work) => (
                  <ArtworkCard key={work.number} work={work} language={language} onOpen={setSelectedNumber} />
                ))}
              </div>

              {visibleCount < filteredWorks.length && (
                <div className="load-more-wrap">
                  <button type="button" className="load-more" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                    {t.loadMore}
                    <span>{Math.min(visibleCount, filteredWorks.length)} / {filteredWorks.length}</span>
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

      <footer className="site-footer">
        <div>
          <strong>Jan Tar Art</strong>
          <p>{t.archiveNote}</p>
        </div>
        <div className="footer-links">
          <span>{t.contact}</span>
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
