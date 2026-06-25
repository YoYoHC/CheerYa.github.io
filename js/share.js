/* =============================================================
 * 分享功能（V2）
 *
 * 规则：
 *   - 不跳页、不开新窗口
 *   - Web Share API 优先，回退复制
 *   - 分享内容固定为首页，不传结果参数
 *   - 链接用 location.origin + pathname 动态拼
 *   - 3 种状态：loading / 成功 / 失败 → Toast
 * ============================================================= */

(function () {
  'use strict';

  var SHARE_TITLE = '测一测你的抗衰人格';
  var SHARE_DESC  = '20道题，测出你的逆龄潜力，看看你属于哪一种抗衰人格。';

  /** 取首页 URL（保留部署子路径，去掉 query/hash） */
  function getHomeUrl() {
    var path = window.location.pathname;
    // 去掉文件名，只保留目录段（例如 /aging-test/app/index.html → /aging-test/app/）
    var lastSlash = path.lastIndexOf('/');
    var base = lastSlash >= 0 ? path.substring(0, lastSlash + 1) : '/';
    return window.location.origin + base;
  }

  /** 简易 Toast：复用屏幕级 div，避免引入新组件 */
  function toast(text, type) {
    type = type || 'info';
    var el = document.createElement('div');
    el.className = 'toast toast-' + type;
    el.textContent = text;
    document.body.appendChild(el);
    // 强制 reflow 才能触发动画
    void el.offsetWidth;
    el.classList.add('toast-show');
    setTimeout(function () {
      el.classList.remove('toast-show');
      setTimeout(function () {
        el.remove && el.remove();
      }, 300);
    }, 1800);
  }

  /** 复制到剪贴板（兼容方案） */
  function copyToClipboard(text) {
    // 优先用现代 API
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      }).catch(function () {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  /** 老浏览器 fallback */
  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  /** 主入口：分享 / 复制 */
  function onShare() {
    var btn = document.getElementById('btn-share');
    if (!btn || btn.disabled) return;
    if (btn.classList.contains('is-loading')) return;

    var url = getHomeUrl();

    // 标记 loading
    btn.classList.add('is-loading');
    btn.disabled = true;
    var origText = btn.textContent;
    btn.textContent = '分享中…';

    var done = function (msg, type) {
      btn.classList.remove('is-loading');
      btn.disabled = false;
      btn.textContent = origText;
      toast(msg, type);
    };

    // 优先 Web Share
    if (navigator.share) {
      try {
        navigator.share({
          title: SHARE_TITLE,
          text: SHARE_DESC,
          url: url
        }).then(function () {
          done('分享成功', 'success');
        }).catch(function (err) {
          // 用户主动取消（AbortError）按成功处理，不算失败
          if (err && err.name === 'AbortError') {
            btn.classList.remove('is-loading');
            btn.disabled = false;
            btn.textContent = origText;
            return;
          }
          // 其他错误降级到复制
          copyToClipboard(url).then(function (ok) {
            done(ok ? '链接已复制' : '分享失败，请稍后重试', ok ? 'success' : 'error');
          });
        });
        return;
      } catch (e) {
        // 走到这里说明 navigator.share 抛同步异常，降级
      }
    }

    // 降级：复制
    copyToClipboard(url).then(function (ok) {
      done(ok ? '链接已复制，快去分享给好友吧～' : '分享失败，请稍后重试', ok ? 'success' : 'error');
    });
  }

  // 事件绑定（DOMContentLoaded 已过也兼容）
  function bind() {
    var btn = document.getElementById('btn-share');
    if (!btn) return;
    btn.addEventListener('click', onShare);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
