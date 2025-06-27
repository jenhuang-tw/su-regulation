import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { useSSRContext } from 'vue';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const lawList = [
      [58, "\u7D44\u7E54\u7AE0\u7A0B"],
      [581, "\u81EA\u6CBB\u8CC7\u8A0A\u516C\u958B\u6CD5"]
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><p>\u570B\u7ACB\u81FA\u5317\u5927\u5B78\u5B78\u751F\u81EA\u6CBB\u6703 \u6CD5\u898F\u7CFB\u7D71 v2.1</p><p>\u8ACB\u512A\u5148\u81F3\u672C\u6703\u7DB2\u7AD9\u67E5\u8A62\u3002\u4EFB\u4F55\u7591\u554F\u8ACB\u6D3D\u7E3D\u6703\u79D8\u66F8\u8655\u3002</p><ul><!--[-->`);
      ssrRenderList(lawList, ([id, title]) => {
        _push(`<li>${ssrInterpolate(id.toString().padStart(4, "0"))}. <a${ssrRenderAttr("href", `embed/${id}`)}>${ssrInterpolate(title)}</a></li>`);
      });
      _push(`<!--]--></ul></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BSJDWuR0.mjs.map
