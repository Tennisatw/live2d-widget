/*!
 * Live2D Widget
 * https://github.com/tennisatw/live2d-widget
 */
!(function () {
  "use strict";
  function e(e) {
    return Array.isArray(e) ? e[Math.floor(Math.random() * e.length)] : e;
  }
  let t;
  function o(o, s, n) {
    if (
      !o ||
      (sessionStorage.getItem("waifu-text") &&
        sessionStorage.getItem("waifu-text") > n)
    )
      return;
    t && (clearTimeout(t), (t = null)),
      (o = e(o)),
      sessionStorage.setItem("waifu-text", n);
    const i = document.getElementById("waifu-tips");
    (i.innerHTML = o),
      i.classList.add("waifu-tips-active"),
      (t = setTimeout(() => {
        sessionStorage.removeItem("waifu-text"),
          i.classList.remove("waifu-tips-active");
      }, s));
  }
  class s {
    constructor(e) {
      let { apiPath: t, cdnPath: o } = e,
        s = !1;
      if ("string" == typeof o) (s = !0), o.endsWith("/") || (o += "/");
      else {
        if ("string" != typeof t) throw "Invalid initWidget argument!";
        t.endsWith("/") || (t += "/");
      }
      (this.useCDN = s), (this.apiPath = t), (this.cdnPath = o);
    }
    async loadModelList() {
      const e = await fetch(`${this.cdnPath}model_list.json`);
      this.modelList = await e.json();
    }
    async loadModel(t, s, n) {
      if (
        (localStorage.setItem("modelId", t),
        localStorage.setItem("modelTexturesId", s),
        o(n, 3e3, 10),
        this.useCDN)
      ) {
        this.modelList || (await this.loadModelList());
        const o = e(this.modelList.models[t]);
        loadlive2d("live2d", `${this.cdnPath}model/${o}/index.json`);
      } else
        loadlive2d("live2d", `${this.apiPath}get/?id=${t}-${s}`),
          console.log(`Live2D 模型 ${t}-${s} 加载完成`);
    }
    async loadRandModel() {
      const t = localStorage.getItem("modelId"),
        s = localStorage.getItem("modelTexturesId");
      if (this.useCDN) {
        this.modelList || (await this.loadModelList());
        const s = e(this.modelList.models[t]);
        loadlive2d("live2d", `${this.cdnPath}model/${s}/index.json`),
          o("我的新衣服好看嘛？", 3e3, 10);
      } else
        fetch(`${this.apiPath}rand_textures/?id=${t}-${s}`)
          .then((e) => e.json())
          .then((e) => {
            1 !== e.textures.id || (1 !== s && 0 !== s)
              ? this.loadModel(t, e.textures.id, "我的新衣服好看嘛？")
              : o("我还没有其他衣服呢！", 3e3, 10);
          });
    }
    async loadOtherModel() {
      let e = localStorage.getItem("modelId");
      if (this.useCDN) {
        this.modelList || (await this.loadModelList());
        const t = ++e >= this.modelList.models.length ? 0 : e;
        this.loadModel(t, 0, this.modelList.messages[t]);
      } else
        fetch(`${this.apiPath}switch/?id=${e}`)
          .then((e) => e.json())
          .then((e) => {
            this.loadModel(e.model.id, 0, e.model.message);
          });
    }
  }
  const n = {
    quit: {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">\x3c!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --\x3e<path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>',
      callback: () => {
        localStorage.setItem("waifu-display", Date.now()),
          o("我先去后台啦，点击左下角的蓝紫色标签我就会回来 - I'm heading to the backstage now. Click on the blue-purple tag at the bottom left, and I'll be back.", 3e3, 11),
          (document.getElementById("waifu").style.bottom = "-500px"),
          setTimeout(() => {
            (document.getElementById("waifu").style.display = "none"),
              document
                .getElementById("waifu-toggle")
                .classList.add("waifu-toggle-active");
          }, 3e3);
      },
    },
  };
  function i(t) {
    const i = new s(t);
    function c(t) {
      let s,
        n = !1,
        i = t.message.default;
      window.addEventListener("mousemove", () => (n = !0)),
        window.addEventListener("keydown", () => (n = !0)),
        setInterval(() => {
          n
            ? ((n = !1), clearInterval(s), (s = null))
            : s ||
              (s = setInterval(() => {
                o(i, 3e3, 9);
              }, 2e4));
        }, 1e3),
        o(
          (function (e) {
            if ("/" === location.pathname)
              for (let { hour: t, text: o } of e) {
                const e = new Date(),
                  s = t.split("-")[0],
                  n = t.split("-")[1] || s;
                if (s <= e.getHours() && e.getHours() <= n) return o;
              }
            const t = `欢迎阅读 <span> ${document.title} </span> - Welcome reading <span> ${document.title} </span>`;
            let o;
            if ("" !== document.referrer) {
              const e = new URL(document.referrer),
                s = e.hostname.split(".")[1],
                n = { baidu: "百度", so: "360搜索", google: "谷歌搜索" };
              return location.hostname === e.hostname
                ? t
                : ((o = s in n ? n[s] : e.hostname),
                  `Hello！来自 <span>${o}</span> 的读者 - Hello! Readers from <span>${o}</span><br>${t}`);
            }
            return t;
          })(t.time),
          3e3,
          11
        ),
        window.addEventListener("mouseover", (s) => {
          for (let { selector: n, text: i } of t.mouseover)
            if (s.target.matches(n))
              return (
                (i = e(i)),
                (i = i.replace("{text}", s.target.innerText)),
                (i = i.replace("{id}", s.target.id)),
                void o(i, 3e3, 8)
              );
        }),
        window.addEventListener("click", (s) => {
          for (let { selector: n, text: i } of t.click)
            if (s.target.matches(n))
              return (
                (i = e(i)),
                (i = i.replace("{text}", s.target.innerText)),
                (i = i.replace("{id}", s.target.id)),
                void o(i, 3e3, 8)
              );
        }),
        t.seasons.forEach(({ date: t, text: o }) => {
          const s = new Date(),
            n = t.split("-")[0],
            c = t.split("-")[1] || n;
          n.split("/")[0] <= s.getMonth() + 1 &&
            s.getMonth() + 1 <= c.split("/")[0] &&
            n.split("/")[1] <= s.getDate() &&
            s.getDate() <= c.split("/")[1] &&
            ((o = (o = e(o)).replace("{year}", s.getFullYear())), i.push(o));
        });
      const c = () => {};
      console.log("%c", c),
        (c.toString = () => {
          o(t.message.console, 3e3, 9);
        }),
        window.addEventListener("copy", () => {
          o(t.message.copy, 3e3, 9);
        }),
        window.addEventListener("visibilitychange", () => {
          document.hidden || o(t.message.visibilitychange, 3e3, 9);
        });
    }
    localStorage.removeItem("waifu-display"),
      sessionStorage.removeItem("waifu-text"),
      document.body.insertAdjacentHTML(
        "beforeend",
        '<div id="waifu">\n            <div id="waifu-tips"></div>\n            <canvas id="live2d" width="800" height="800"></canvas>\n            <div id="waifu-tool"></div>\n        </div>'
      ),
      setTimeout(() => {
        document.getElementById("waifu").style.bottom = 0;
      }, 0),
      (function () {
        (n["switch-model"].callback = () => i.loadOtherModel()),
          (n["switch-texture"].callback = () => i.loadRandModel()),
          Array.isArray(t.tools) || (t.tools = Object.keys(n));
        for (let e of t.tools)
          if (n[e]) {
            const { icon: t, callback: o } = n[e];
            document
              .getElementById("waifu-tool")
              .insertAdjacentHTML(
                "beforeend",
                `<span id="waifu-tool-${e}">${t}</span>`
              ),
              document
                .getElementById(`waifu-tool-${e}`)
                .addEventListener("click", o);
          }
      })(),
      (function () {
        let e = localStorage.getItem("modelId"),
          o = localStorage.getItem("modelTexturesId");
        null === e && ((e = 1), (o = 53)),
          i.loadModel(e, o),
          fetch(t.waifuPath)
            .then((e) => e.json())
            .then(c);
      })();
  }
  window.initWidget = function (e, t) {
    "string" == typeof e && (e = { waifuPath: e, apiPath: t }),
      document.body.insertAdjacentHTML(
        "beforeend",
        '<div id="waifu-toggle">\n            <span>Tbot</span>\n        </div>'
      );
    const o = document.getElementById("waifu-toggle");
    o.addEventListener("click", () => {
      o.classList.remove("waifu-toggle-active"),
        o.getAttribute("first-time")
          ? (i(e), o.removeAttribute("first-time"))
          : (localStorage.removeItem("waifu-display"),
            (document.getElementById("waifu").style.display = ""),
            setTimeout(() => {
              document.getElementById("waifu").style.bottom = 0;
            }, 0));
    }),
      localStorage.getItem("waifu-display") &&
      Date.now() - localStorage.getItem("waifu-display") <= 864e5
        ? (o.setAttribute("first-time", !0),
          setTimeout(() => {
            o.classList.add("waifu-toggle-active");
          }, 0))
        : i(e);
  };
})();
