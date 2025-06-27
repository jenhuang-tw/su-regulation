import { ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { d as useRoute } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.id;
    const regulation = ref({
      titleFull: "",
      modifiedType: "",
      modifiedDate: "",
      status: "",
      history: "",
      fullText: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(_attrs)}><p><span style="${ssrRenderStyle({ "font-weight": "bold" })}">\u6CD5\u898F\u540D\u7A31\uFF1A</span>${ssrInterpolate(unref(regulation).titleFull)} `);
      if (unref(regulation).status === "abandoned") {
        _push(`<span style="${ssrRenderStyle({ "color": "red" })}">(\u5EE2\u6B62)</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p><p><span style="${ssrRenderStyle({ "font-weight": "bold" })}">${ssrInterpolate(unref(regulation).modifiedType)}\u65E5\u671F\uFF1A</span>${ssrInterpolate(unref(regulation).modifiedDate)}</p><h2 class="wp-block-heading">\u5168\u6587</h2>`);
      if (unref(regulation).fullText) {
        _push(`<div>${(_a = unref(regulation).fullText) != null ? _a : ""}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h2 class="wp-block-heading">\u6CBF\u9769</h2><ol><!--[-->`);
      ssrRenderList(unref(regulation).history, (item, index) => {
        _push(`<li>${ssrInterpolate(item)}</li>`);
      });
      _push(`<!--]--></ol></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/regulation/[id]/embed/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CimvQe3F.mjs.map
