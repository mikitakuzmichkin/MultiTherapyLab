const offers = {
  clients: {
    price: "1\u00a0080",
    half: "540 Br сейчас, остаток до 3 ноября",
    items: [
      "8 живых встреч в группе до 12 человек",
      "Запись и конспект после каждой встречи",
      "Практика между встречами — 20–40 минут",
      "Разбор одной учебной сессии с частным запросом",
      "Как говорить о деньгах, отказе и границах",
    ],
  },
  business: {
    price: "890",
    half: "445 Br сейчас, остаток до 3 ноября",
    items: [
      "6 живых встреч в группе до 12 человек",
      "Как брать бриф у руководителя и сужать задачу",
      "Формат работы с командой на 60–90 минут",
      "Разбор одного учебного бизнес-кейса",
      "Запись и конспект",
    ],
  },
  workshop: {
    price: "180",
    half: "Оплата целиком до дня мастеркласса",
    items: [
      "3 часа живой работы",
      "Один навык: встреча, бизнес-задача или карта в сессии",
      "Разбор учебного случая",
      "Конспект",
      "Группа до 16 человек",
      "Запись остаётся на 30 дней",
    ],
  },
  series: {
    price: "480",
    half: "Три вечера: 12 ноября, 26 ноября и 10 декабря",
    items: [
      "Все три мастеркласса цикла",
      "Первая встреча, задача бизнеса и карта в сессии",
      "Конспекты и записи на 30 дней",
      "Можно оплатить двумя частями",
    ],
  },
};

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const panel = document.querySelector(".mobile-panel");
const priceValue = document.querySelector("#price-value");
const priceHalf = document.querySelector("#price-half");

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    const open = card.classList.toggle("is-open");
    card.setAttribute("aria-pressed", String(open));
  });
});

function onScroll() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 8);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (toggle && panel) {
  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Закрыть" : "Меню";
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      panel.classList.remove("open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Меню";
    });
  });
}

function showOffer(key) {
  const offer = offers[key];
  if (!offer) return;
  priceValue.textContent = offer.price;
  priceHalf.textContent = offer.half;
  const list = document.querySelector("#included");
  if (list && offer.items) {
    list.replaceChildren(
      ...offer.items.map((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        return item;
      })
    );
  }
  document.querySelectorAll("[data-offer]").forEach((button) => {
    button.classList.toggle("is-on", button.dataset.offer === key);
  });
}

document.querySelectorAll("[data-offer]").forEach((button) => {
  button.addEventListener("click", () => showOffer(button.dataset.offer));
});

document.querySelectorAll("[data-course]").forEach((link) => {
  link.addEventListener("click", () => {
    showOffer(link.dataset.course);
  });
});
