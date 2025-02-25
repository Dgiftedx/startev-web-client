! function(a, b) {
    "function" == typeof define && define.amd ? define(["jquery"], function(a) {
        return b(a)
    }) : "object" == typeof module && module.exports ? module.exports = b(require("jquery")) : b(a.jQuery)
}(this, function(a) {
    ! function(a) {
        "use strict";

        function b(b) {
            var c = [{
                re: /[\xC0-\xC6]/g,
                ch: "A"
            }, {
                re: /[\xE0-\xE6]/g,
                ch: "a"
            }, {
                re: /[\xC8-\xCB]/g,
                ch: "E"
            }, {
                re: /[\xE8-\xEB]/g,
                ch: "e"
            }, {
                re: /[\xCC-\xCF]/g,
                ch: "I"
            }, {
                re: /[\xEC-\xEF]/g,
                ch: "i"
            }, {
                re: /[\xD2-\xD6]/g,
                ch: "O"
            }, {
                re: /[\xF2-\xF6]/g,
                ch: "o"
            }, {
                re: /[\xD9-\xDC]/g,
                ch: "U"
            }, {
                re: /[\xF9-\xFC]/g,
                ch: "u"
            }, {
                re: /[\xC7-\xE7]/g,
                ch: "c"
            }, {
                re: /[\xD1]/g,
                ch: "N"
            }, {
                re: /[\xF1]/g,
                ch: "n"
            }];
            return a.each(c, function() {
                b = b ? b.replace(this.re, this.ch) : ""
            }), b
        }

        function c(b) {
            var c = arguments,
                d = b;
            [].shift.apply(c);
            var e, f = this.each(function() {
                var b = a(this);
                if (b.is("selectize")) {
                    var f = b.data("selectpicker"),
                        g = "object" == typeof d && d;
                    if (f) {
                        if (g)
                            for (var h in g) g.hasOwnProperty(h) && (f.options[h] = g[h])
                    } else {
                        var i = a.extend({}, l.DEFAULTS, a.fn.selectpicker.defaults || {}, b.data(), g);
                        i.template = a.extend({}, l.DEFAULTS.template, a.fn.selectpicker.defaults ? a.fn.selectpicker.defaults.template : {}, b.data().template, g.template), b.data("selectpicker", f = new l(this, i))
                    }
                    "string" == typeof d && (e = f[d] instanceof Function ? f[d].apply(f, c) : f.options[d])
                }
            });
            return void 0 !== e ? e : f
        }
        String.prototype.includes || function() {
            var a = {}.toString,
                b = function() {
                    try {
                        var a = {},
                            b = Object.defineProperty,
                            c = b(a, a, a) && b
                    } catch (a) {}
                    return c
                }(),
                c = "".indexOf,
                d = function(b) {
                    if (null == this) throw new TypeError;
                    var d = String(this);
                    if (b && "[object RegExp]" == a.call(b)) throw new TypeError;
                    var e = d.length,
                        f = String(b),
                        g = f.length,
                        h = arguments.length > 1 ? arguments[1] : void 0,
                        i = h ? Number(h) : 0;
                    return i != i && (i = 0), !(g + Math.min(Math.max(i, 0), e) > e) && -1 != c.call(d, f, i)
                };
            b ? b(String.prototype, "includes", {
                value: d,
                configurable: !0,
                writable: !0
            }) : String.prototype.includes = d
        }(), String.prototype.startsWith || function() {
            var a = function() {
                    try {
                        var a = {},
                            b = Object.defineProperty,
                            c = b(a, a, a) && b
                    } catch (a) {}
                    return c
                }(),
                b = {}.toString,
                c = function(a) {
                    if (null == this) throw new TypeError;
                    var c = String(this);
                    if (a && "[object RegExp]" == b.call(a)) throw new TypeError;
                    var d = c.length,
                        e = String(a),
                        f = e.length,
                        g = arguments.length > 1 ? arguments[1] : void 0,
                        h = g ? Number(g) : 0;
                    h != h && (h = 0);
                    var i = Math.min(Math.max(h, 0), d);
                    if (f + i > d) return !1;
                    for (var j = -1; ++j < f;)
                        if (c.charCodeAt(i + j) != e.charCodeAt(j)) return !1;
                    return !0
                };
            a ? a(String.prototype, "startsWith", {
                value: c,
                configurable: !0,
                writable: !0
            }) : String.prototype.startsWith = c
        }(), Object.keys || (Object.keys = function(a, b, c) {
            c = [];
            for (b in a) c.hasOwnProperty.call(a, b) && c.push(b);
            return c
        });
        var d = {
            useDefault: !1,
            _set: a.valHooks.select.set
        };
        a.valHooks.select.set = function(b, c) {
            return c && !d.useDefault && a(b).data("selected", !0), d._set.apply(this, arguments)
        };
        var e = null,
            f = function() {
                try {
                    return new Event("change"), !0
                } catch (a) {
                    return !1
                }
            }();
        a.fn.triggerNative = function(a) {
            var b, c = this[0];
            c.dispatchEvent ? (f ? b = new Event(a, {
                bubbles: !0
            }) : (b = document.createEvent("Event"), b.initEvent(a, !0, !1)), c.dispatchEvent(b)) : c.fireEvent ? (b = document.createEventObject(), b.eventType = a, c.fireEvent("on" + a, b)) : this.trigger(a)
        }, a.expr.pseudos.icontains = function(b, c, d) {
            var e = a(b).find("a");
            return (e.data("tokens") || e.text()).toString().toUpperCase().includes(d[3].toUpperCase())
        }, a.expr.pseudos.ibegins = function(b, c, d) {
            var e = a(b).find("a");
            return (e.data("tokens") || e.text()).toString().toUpperCase().startsWith(d[3].toUpperCase())
        }, a.expr.pseudos.aicontains = function(b, c, d) {
            var e = a(b).find("a");
            return (e.data("tokens") || e.data("normalizedText") || e.text()).toString().toUpperCase().includes(d[3].toUpperCase())
        }, a.expr.pseudos.aibegins = function(b, c, d) {
            var e = a(b).find("a");
            return (e.data("tokens") || e.data("normalizedText") || e.text()).toString().toUpperCase().startsWith(d[3].toUpperCase())
        };
        var g = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            },
            h = {
                "&amp;": "&",
                "&lt;": "<",
                "&gt;": ">",
                "&quot;": '"',
                "&#x27;": "'",
                "&#x60;": "`"
            },
            i = function(a) {
                var b = function(b) {
                        return a[b]
                    },
                    c = "(?:" + Object.keys(a).join("|") + ")",
                    d = RegExp(c),
                    e = RegExp(c, "g");
                return function(a) {
                    return a = null == a ? "" : "" + a, d.test(a) ? a.replace(e, b) : a
                }
            },
            j = i(g),
            k = i(h),
            l = function(b, c) {
                d.useDefault || (a.valHooks.select.set = d._set, d.useDefault = !0), this.$element = a(b), this.$newElement = null, this.$button = null, this.$menu = null, this.$lis = null, this.options = c, null === this.options.title && (this.options.title = this.$element.attr("title"));
                var e = this.options.windowPadding;
                "number" == typeof e && (this.options.windowPadding = [e, e, e, e]), this.val = l.prototype.val, this.render = l.prototype.render, this.refresh = l.prototype.refresh, this.setStyle = l.prototype.setStyle, this.selectAll = l.prototype.selectAll, this.deselectAll = l.prototype.deselectAll, this.destroy = l.prototype.destroy, this.remove = l.prototype.remove, this.show = l.prototype.show, this.hide = l.prototype.hide, this.init()
            };
        l.VERSION = "1.12.4", l.DEFAULTS = {
            noneSelectedText: "Nothing selected",
            noneResultsText: "No results matched {0}",
            countSelectedText: function(a, b) {
                return 1 == a ? "{0} item selected" : "{0} items selected"
            },
            maxOptionsText: function(a, b) {
                return [1 == a ? "Limit reached ({n} item max)" : "Limit reached ({n} items max)", 1 == b ? "Group limit reached ({n} item max)" : "Group limit reached ({n} items max)"]
            },
            selectAllText: "Select All",
            deselectAllText: "Deselect All",
            doneButton: !1,
            doneButtonText: "Close",
            multipleSeparator: ", ",
            styleBase: "btn",
            style: "btn-round btn-simple",
            size: "auto",
            title: null,
            selectedTextFormat: "values",
            width: !1,
            container: !1,
            hideDisabled: !1,
            showSubtext: !1,
            showIcon: !0,
            showContent: !0,
            dropupAuto: !0,
            header: !1,
            liveSearch: !1,
            liveSearchPlaceholder: null,
            liveSearchNormalize: !1,
            liveSearchStyle: "contains",
            actionsBox: !1,
            iconBase: "glyphicon",
            tickIcon: "glyphicon-ok",
            showTick: !1,
            template: {
                caret: '<span class="caret"></span>'
            },
            maxOptions: !1,
            mobile: !1,
            selectOnTab: !1,
            dropdownAlignRight: !1,
            windowPadding: 0
        }, l.prototype = {
            constructor: l,
            init: function() {
                var b = this,
                    c = this.$element.attr("id");
                this.$element.addClass("bs-select-hidden"), this.liObj = {}, this.multiple = this.$element.prop("multiple"), this.autofocus = this.$element.prop("autofocus"), this.$newElement = this.createView(), this.$element.after(this.$newElement).appendTo(this.$newElement), this.$button = this.$newElement.children("button"), this.$menu = this.$newElement.children(".dropdown-menu"), this.$menuInner = this.$menu.children(".inner"), this.$searchbox = this.$menu.find("input"), this.$element.removeClass("bs-select-hidden"), !0 === this.options.dropdownAlignRight && this.$menu.addClass("dropdown-menu-right"), void 0 !== c && (this.$button.attr("data-id", c), a('label[for="' + c + '"]').click(function(a) {
                    a.preventDefault(), b.$button.focus()
                })), this.checkDisabled(), this.clickListener(), this.options.liveSearch && this.liveSearchListener(), this.render(), this.setStyle(), this.setWidth(), this.options.container && this.selectPosition(), this.$menu.data("this", this), this.$newElement.data("this", this), this.options.mobile && this.mobile(), this.$newElement.on({
                    "hide.bs.dropdown": function(a) {
                        b.$menuInner.attr("aria-expanded", !1), b.$element.trigger("hide.bs.select", a)
                    },
                    "hidden.bs.dropdown": function(a) {
                        b.$element.trigger("hidden.bs.select", a)
                    },
                    "show.bs.dropdown": function(a) {
                        b.$menuInner.attr("aria-expanded", !0), b.$element.trigger("show.bs.select", a)
                    },
                    "shown.bs.dropdown": function(a) {
                        b.$element.trigger("shown.bs.select", a)
                    }
                }), b.$element[0].hasAttribute("required") && this.$element.on("invalid", function() {
                    b.$button.addClass("bs-invalid"), b.$element.on({
                        "focus.bs.select": function() {
                            b.$button.focus(), b.$element.off("focus.bs.select")
                        },
                        "shown.bs.select": function() {
                            b.$element.val(b.$element.val()).off("shown.bs.select")
                        },
                        "rendered.bs.select": function() {
                            this.validity.valid && b.$button.removeClass("bs-invalid"), b.$element.off("rendered.bs.select")
                        }
                    }), b.$button.on("blur.bs.select", function() {
                        b.$element.focus().blur(), b.$button.off("blur.bs.select")
                    })
                }), setTimeout(function() {
                    b.$element.trigger("loaded.bs.select")
                })
            },
            createDropdown: function() {
                var b = this.multiple || this.options.showTick ? " show-tick" : "",
                    c = this.$element.parent().hasClass("input-group") ? " input-group-btn" : "",
                    d = this.autofocus ? " autofocus" : "",
                    e = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + "</div>" : "",
                    f = this.options.liveSearch ? '<div class="bs-searchbox"><input type="text" class="form-control" autocomplete="off"' + (null === this.options.liveSearchPlaceholder ? "" : ' placeholder="' + j(this.options.liveSearchPlaceholder) + '"') + ' role="textbox" aria-label="Search"></div>' : "",
                    g = this.multiple && this.options.actionsBox ? '<div class="bs-actionsbox"><div class="btn-group btn-group-sm btn-block"><button type="button" class="actions-btn bs-select-all btn btn-default">' + this.options.selectAllText + '</button><button type="button" class="actions-btn bs-deselect-all btn btn-default">' + this.options.deselectAllText + "</button></div></div>" : "",
                    h = this.multiple && this.options.doneButton ? '<div class="bs-donebutton"><div class="btn-group btn-block"><button type="button" class="btn btn-sm btn-default">' + this.options.doneButtonText + "</button></div></div>" : "",
                    i = '<div class="btn-group bootstrap-select' + b + c + '"><button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + d + ' role="button"><span class="filter-option pull-left"></span>&nbsp;<span class="bs-caret">' + this.options.template.caret + '</span></button><div class="dropdown-menu" role="combobox">' + e + f + g + '<ul class="dropdown-menu inner" role="listbox" aria-expanded="false"></ul>' + h + "</div></div>";
                return a(i)
            },
            createView: function() {
                var a = this.createDropdown(),
                    b = this.createLi();
                return a.find("ul")[0].innerHTML = b, a
            },
            reloadLi: function() {
                var a = this.createLi();
                this.$menuInner[0].innerHTML = a
            },
            createLi: function() {
                var c = this,
                    d = [],
                    e = 0,
                    f = document.createElement("option"),
                    g = -1,
                    h = function(a, b, c, d) {
                        return "<li" + (void 0 !== c && "" !== c ? ' class="' + c + '"' : "") + (void 0 !== b && null !== b ? ' data-original-index="' + b + '"' : "") + (void 0 !== d && null !== d ? 'data-optgroup="' + d + '"' : "") + ">" + a + "</li>"
                    },
                    i = function(d, e, f, g) {
                        return '<a tabindex="0"' + (void 0 !== e ? ' class="' + e + '"' : "") + (f ? ' style="' + f + '"' : "") + (c.options.liveSearchNormalize ? ' data-normalized-text="' + b(j(a(d).html())) + '"' : "") + (void 0 !== g || null !== g ? ' data-tokens="' + g + '"' : "") + ' role="option">' + d + '<span class="' + c.options.iconBase + " " + c.options.tickIcon + ' check-mark"></span></a>'
                    };
                if (this.options.title && !this.multiple && (g--, !this.$element.find(".bs-title-option").length)) {
                    var k = this.$element[0];
                    f.className = "bs-title-option", f.innerHTML = this.options.title, f.value = "", k.insertBefore(f, k.firstChild);
                    void 0 === a(k.options[k.selectedIndex]).attr("selected") && void 0 === this.$element.data("selected") && (f.selected = !0)
                }
                var l = this.$element.find("option");
                return l.each(function(b) {
                    var f = a(this);
                    if (g++, !f.hasClass("bs-title-option")) {
                        var k, m = this.className || "",
                            n = j(this.style.cssText),
                            o = f.data("content") ? f.data("content") : f.html(),
                            p = f.data("tokens") ? f.data("tokens") : null,
                            q = void 0 !== f.data("subtext") ? '<small class="text-muted">' + f.data("subtext") + "</small>" : "",
                            r = void 0 !== f.data("icon") ? '<span class="' + c.options.iconBase + " " + f.data("icon") + '"></span> ' : "",
                            s = f.parent(),
                            t = "OPTGROUP" === s[0].tagName,
                            u = t && s[0].disabled,
                            v = this.disabled || u;
                        if ("" !== r && v && (r = "<span>" + r + "</span>"), c.options.hideDisabled && (v && !t || u)) return k = f.data("prevHiddenIndex"), f.next().data("prevHiddenIndex", void 0 !== k ? k : b), void g--;
                        if (f.data("content") || (o = r + '<span class="text">' + o + q + "</span>"), t && !0 !== f.data("divider")) {
                            if (c.options.hideDisabled && v) {
                                if (void 0 === s.data("allOptionsDisabled")) {
                                    var w = s.children();
                                    s.data("allOptionsDisabled", w.filter(":disabled").length === w.length)
                                }
                                if (s.data("allOptionsDisabled")) return void g--
                            }
                            var x = " " + s[0].className || "";
                            if (0 === f.index()) {
                                e += 1;
                                var y = s[0].label,
                                    z = void 0 !== s.data("subtext") ? '<small class="text-muted">' + s.data("subtext") + "</small>" : "";
                                y = (s.data("icon") ? '<span class="' + c.options.iconBase + " " + s.data("icon") + '"></span> ' : "") + '<span class="text">' + j(y) + z + "</span>", 0 !== b && d.length > 0 && (g++, d.push(h("", null, "divider", e + "div"))), g++, d.push(h(y, null, "dropdown-header" + x, e))
                            }
                            if (c.options.hideDisabled && v) return void g--;
                            d.push(h(i(o, "opt " + m + x, n, p), b, "", e))
                        } else if (!0 === f.data("divider")) d.push(h("", b, "divider"));
                        else if (!0 === f.data("hidden")) k = f.data("prevHiddenIndex"), f.next().data("prevHiddenIndex", void 0 !== k ? k : b), d.push(h(i(o, m, n, p), b, "hidden is-hidden"));
                        else {
                            var A = this.previousElementSibling && "OPTGROUP" === this.previousElementSibling.tagName;
                            if (!A && c.options.hideDisabled && void 0 !== (k = f.data("prevHiddenIndex"))) {
                                var B = l.eq(k)[0].previousElementSibling;
                                B && "OPTGROUP" === B.tagName && !B.disabled && (A = !0)
                            }
                            A && (g++, d.push(h("", null, "divider", e + "div"))), d.push(h(i(o, m, n, p), b))
                        }
                        c.liObj[b] = g
                    }
                }), this.multiple || 0 !== this.$element.find("option:selected").length || this.options.title || this.$element.find("option").eq(0).prop("selected", !0).attr("selected", "selected"), d.join("")
            },
            findLis: function() {
                return null == this.$lis && (this.$lis = this.$menu.find("li")), this.$lis
            },
            render: function(b) {
                var c, d = this,
                    e = this.$element.find("option");
                !1 !== b && e.each(function(a) {
                    var b = d.findLis().eq(d.liObj[a]);
                    d.setDisabled(a, this.disabled || "OPTGROUP" === this.parentNode.tagName && this.parentNode.disabled, b), d.setSelected(a, this.selected, b)
                }), this.togglePlaceholder(), this.tabIndex();
                var f = e.map(function() {
                        if (this.selected) {
                            if (d.options.hideDisabled && (this.disabled || "OPTGROUP" === this.parentNode.tagName && this.parentNode.disabled)) return;
                            var b, c = a(this),
                                e = c.data("icon") && d.options.showIcon ? '<i class="' + d.options.iconBase + " " + c.data("icon") + '"></i> ' : "";
                            return b = d.options.showSubtext && c.data("subtext") && !d.multiple ? ' <small class="text-muted">' + c.data("subtext") + "</small>" : "", void 0 !== c.attr("title") ? c.attr("title") : c.data("content") && d.options.showContent ? c.data("content").toString() : e + c.html() + b
                        }
                    }).toArray(),
                    g = this.multiple ? f.join(this.options.multipleSeparator) : f[0];
                if (this.multiple && this.options.selectedTextFormat.indexOf("count") > -1) {
                    var h = this.options.selectedTextFormat.split(">");
                    if (h.length > 1 && f.length > h[1] || 1 == h.length && f.length >= 2) {
                        c = this.options.hideDisabled ? ", [disabled]" : "";
                        var i = e.not('[data-divider="true"], [data-hidden="true"]' + c).length;
                        g = ("function" == typeof this.options.countSelectedText ? this.options.countSelectedText(f.length, i) : this.options.countSelectedText).replace("{0}", f.length.toString()).replace("{1}", i.toString())
                    }
                }
                void 0 == this.options.title && (this.options.title = this.$element.attr("title")), "static" == this.options.selectedTextFormat && (g = this.options.title), g || (g = void 0 !== this.options.title ? this.options.title : this.options.noneSelectedText), this.$button.attr("title", k(a.trim(g.replace(/<[^>]*>?/g, "")))), this.$button.children(".filter-option").html(g), this.$element.trigger("rendered.bs.select")
            },
            setStyle: function(a, b) {
                this.$element.attr("class") && this.$newElement.addClass(this.$element.attr("class").replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ""));
                var c = a || this.options.style;
                "add" == b ? this.$button.addClass(c) : "remove" == b ? this.$button.removeClass(c) : (this.$button.removeClass(this.options.style), this.$button.addClass(c))
            },
            liHeight: function(b) {
                if (b || !1 !== this.options.size && !this.sizeInfo) {
                    var c = document.createElement("div"),
                        d = document.createElement("div"),
                        e = document.createElement("ul"),
                        f = document.createElement("li"),
                        g = document.createElement("li"),
                        h = document.createElement("a"),
                        i = document.createElement("span"),
                        j = this.options.header && this.$menu.find(".popover-title").length > 0 ? this.$menu.find(".popover-title")[0].cloneNode(!0) : null,
                        k = this.options.liveSearch ? document.createElement("div") : null,
                        l = this.options.actionsBox && this.multiple && this.$menu.find(".bs-actionsbox").length > 0 ? this.$menu.find(".bs-actionsbox")[0].cloneNode(!0) : null,
                        m = this.options.doneButton && this.multiple && this.$menu.find(".bs-donebutton").length > 0 ? this.$menu.find(".bs-donebutton")[0].cloneNode(!0) : null;
                    if (i.className = "text", c.className = this.$menu[0].parentNode.className + " open", d.className = "dropdown-menu", e.className = "dropdown-menu inner", f.className = "divider", i.appendChild(document.createTextNode("Inner text")), h.appendChild(i), g.appendChild(h), e.appendChild(g), e.appendChild(f), j && d.appendChild(j), k) {
                        var n = document.createElement("input");
                        k.className = "bs-searchbox", n.className = "form-control", k.appendChild(n), d.appendChild(k)
                    }
                    l && d.appendChild(l), d.appendChild(e), m && d.appendChild(m), c.appendChild(d), document.body.appendChild(c);
                    var o = h.offsetHeight,
                        p = j ? j.offsetHeight : 0,
                        q = k ? k.offsetHeight : 0,
                        r = l ? l.offsetHeight : 0,
                        s = m ? m.offsetHeight : 0,
                        t = a(f).outerHeight(!0),
                        u = "function" == typeof getComputedStyle && getComputedStyle(d),
                        v = u ? null : a(d),
                        w = {
                            vert: parseInt(u ? u.paddingTop : v.css("paddingTop")) + parseInt(u ? u.paddingBottom : v.css("paddingBottom")) + parseInt(u ? u.borderTopWidth : v.css("borderTopWidth")) + parseInt(u ? u.borderBottomWidth : v.css("borderBottomWidth")),
                            horiz: parseInt(u ? u.paddingLeft : v.css("paddingLeft")) + parseInt(u ? u.paddingRight : v.css("paddingRight")) + parseInt(u ? u.borderLeftWidth : v.css("borderLeftWidth")) + parseInt(u ? u.borderRightWidth : v.css("borderRightWidth"))
                        },
                        x = {
                            vert: w.vert + parseInt(u ? u.marginTop : v.css("marginTop")) + parseInt(u ? u.marginBottom : v.css("marginBottom")) + 2,
                            horiz: w.horiz + parseInt(u ? u.marginLeft : v.css("marginLeft")) + parseInt(u ? u.marginRight : v.css("marginRight")) + 2
                        };
                    document.body.removeChild(c), this.sizeInfo = {
                        liHeight: o,
                        headerHeight: p,
                        searchHeight: q,
                        actionsHeight: r,
                        doneButtonHeight: s,
                        dividerHeight: t,
                        menuPadding: w,
                        menuExtras: x
                    }
                }
            },
            setSize: function() {
                if (this.findLis(), this.liHeight(), this.options.header && this.$menu.css("padding-top", 0), !1 !== this.options.size) {
                    var b, c, d, e, f, g, h, i, j = this,
                        k = this.$menu,
                        l = this.$menuInner,
                        m = a(window),
                        n = this.$newElement[0].offsetHeight,
                        o = this.$newElement[0].offsetWidth,
                        p = this.sizeInfo.liHeight,
                        q = this.sizeInfo.headerHeight,
                        r = this.sizeInfo.searchHeight,
                        s = this.sizeInfo.actionsHeight,
                        t = this.sizeInfo.doneButtonHeight,
                        u = this.sizeInfo.dividerHeight,
                        v = this.sizeInfo.menuPadding,
                        w = this.sizeInfo.menuExtras,
                        x = this.options.hideDisabled ? ".disabled" : "",
                        y = function() {
                            var b, c = j.$newElement.offset(),
                                d = a(j.options.container);
                            j.options.container && !d.is("body") ? (b = d.offset(), b.top += parseInt(d.css("borderTopWidth")), b.left += parseInt(d.css("borderLeftWidth"))) : b = {
                                top: 0,
                                left: 0
                            };
                            var e = j.options.windowPadding;
                            f = c.top - b.top - m.scrollTop(), g = m.height() - f - n - b.top - e[2], h = c.left - b.left - m.scrollLeft(), i = m.width() - h - o - b.left - e[1], f -= e[0], h -= e[3]
                        };
                    if (y(), "auto" === this.options.size) {
                        var z = function() {
                            var m, n = function(b, c) {
                                    return function(d) {
                                        return c ? d.classList ? d.classList.contains(b) : a(d).hasClass(b) : !(d.classList ? d.classList.contains(b) : a(d).hasClass(b))
                                    }
                                },
                                u = j.$menuInner[0].getElementsByTagName("li"),
                                x = Array.prototype.filter ? Array.prototype.filter.call(u, n("hidden", !1)) : j.$lis.not(".hidden"),
                                z = Array.prototype.filter ? Array.prototype.filter.call(x, n("dropdown-header", !0)) : x.filter(".dropdown-header");
                            y(), b = g - w.vert, c = i - w.horiz, j.options.container ? (k.data("height") || k.data("height", k.height()), d = k.data("height"), k.data("width") || k.data("width", k.width()), e = k.data("width")) : (d = k.height(), e = k.width()), j.options.dropupAuto && j.$newElement.toggleClass("dropup", f > g && b - w.vert < d), j.$newElement.hasClass("dropup") && (b = f - w.vert), "auto" === j.options.dropdownAlignRight && k.toggleClass("dropdown-menu-right", h > i && c - w.horiz < e - o), m = x.length + z.length > 3 ? 3 * p + w.vert - 2 : 0, k.css({
                                "max-height": b + "px",
                                overflow: "hidden",
                                "min-height": m + q + r + s + t + "px"
                            }), l.css({
                                "max-height": b - q - r - s - t - v.vert + "px",
                                "overflow-y": "auto",
                                "min-height": Math.max(m - v.vert, 0) + "px"
                            })
                        };
                        z(), this.$searchbox.off("input.getSize propertychange.getSize").on("input.getSize propertychange.getSize", z), m.off("resize.getSize scroll.getSize").on("resize.getSize scroll.getSize", z)
                    } else if (this.options.size && "auto" != this.options.size && this.$lis.not(x).length > this.options.size) {
                        var A = this.$lis.not(".divider").not(x).children().slice(0, this.options.size).last().parent().index(),
                            B = this.$lis.slice(0, A + 1).filter(".divider").length;
                        b = p * this.options.size + B * u + v.vert, j.options.container ? (k.data("height") || k.data("height", k.height()), d = k.data("height")) : d = k.height(), j.options.dropupAuto && this.$newElement.toggleClass("dropup", f > g && b - w.vert < d), k.css({
                            "max-height": b + q + r + s + t + "px",
                            overflow: "hidden",
                            "min-height": ""
                        }), l.css({
                            "max-height": b - v.vert + "px",
                            "overflow-y": "auto",
                            "min-height": ""
                        })
                    }
                }
            },
            setWidth: function() {
                if ("auto" === this.options.width) {
                    this.$menu.css("min-width", "0");
                    var a = this.$menu.parent().clone().appendTo("body"),
                        b = this.options.container ? this.$newElement.clone().appendTo("body") : a,
                        c = a.children(".dropdown-menu").outerWidth(),
                        d = b.css("width", "auto").children("button").outerWidth();
                    a.remove(), b.remove(), this.$newElement.css("width", Math.max(c, d) + "px")
                } else "fit" === this.options.width ? (this.$menu.css("min-width", ""), this.$newElement.css("width", "").addClass("fit-width")) : this.options.width ? (this.$menu.css("min-width", ""), this.$newElement.css("width", this.options.width)) : (this.$menu.css("min-width", ""), this.$newElement.css("width", ""));
                this.$newElement.hasClass("fit-width") && "fit" !== this.options.width && this.$newElement.removeClass("fit-width")
            },
            selectPosition: function() {
                this.$bsContainer = a('<div class="bs-container" />');
                var b, c, d, e = this,
                    f = a(this.options.container),
                    g = function(a) {
                        e.$bsContainer.addClass(a.attr("class").replace(/form-control|fit-width/gi, "")).toggleClass("dropup", a.hasClass("dropup")), b = a.offset(), f.is("body") ? c = {
                            top: 0,
                            left: 0
                        } : (c = f.offset(), c.top += parseInt(f.css("borderTopWidth")) - f.scrollTop(), c.left += parseInt(f.css("borderLeftWidth")) - f.scrollLeft()), d = a.hasClass("dropup") ? 0 : a[0].offsetHeight, e.$bsContainer.css({
                            top: b.top - c.top + d,
                            left: b.left - c.left,
                            width: a[0].offsetWidth
                        })
                    };
                this.$button.on("click", function() {
                    var b = a(this);
                    e.isDisabled() || (g(e.$newElement), e.$bsContainer.appendTo(e.options.container).toggleClass("open", !b.hasClass("open")).append(e.$menu))
                }), a(window).on("resize scroll", function() {
                    g(e.$newElement)
                }), this.$element.on("hide.bs.select", function() {
                    e.$menu.data("height", e.$menu.height()), e.$bsContainer.detach()
                })
            },
            setSelected: function(a, b, c) {
                c || (this.togglePlaceholder(), c = this.findLis().eq(this.liObj[a])), c.toggleClass("selected", b).find("a").attr("aria-selected", b)
            },
            setDisabled: function(a, b, c) {
                c || (c = this.findLis().eq(this.liObj[a])), b ? c.addClass("disabled").children("a").attr("href", "#").attr("tabindex", -1).attr("aria-disabled", !0) : c.removeClass("disabled").children("a").removeAttr("href").attr("tabindex", 0).attr("aria-disabled", !1)
            },
            isDisabled: function() {
                return this.$element[0].disabled
            },
            checkDisabled: function() {
                var a = this;
                this.isDisabled() ? (this.$newElement.addClass("disabled"), this.$button.addClass("disabled").attr("tabindex", -1).attr("aria-disabled", !0)) : (this.$button.hasClass("disabled") && (this.$newElement.removeClass("disabled"), this.$button.removeClass("disabled").attr("aria-disabled", !1)), -1 != this.$button.attr("tabindex") || this.$element.data("tabindex") || this.$button.removeAttr("tabindex")), this.$button.click(function() {
                    return !a.isDisabled()
                })
            },
            togglePlaceholder: function() {
                var a = this.$element.val();
                this.$button.toggleClass("bs-placeholder", null === a || "" === a || a.constructor === Array && 0 === a.length)
            },
            tabIndex: function() {
                this.$element.data("tabindex") !== this.$element.attr("tabindex") && -98 !== this.$element.attr("tabindex") && "-98" !== this.$element.attr("tabindex") && (this.$element.data("tabindex", this.$element.attr("tabindex")), this.$button.attr("tabindex", this.$element.data("tabindex"))), this.$element.attr("tabindex", -98)
            },
            clickListener: function() {
                var b = this,
                    c = a(document);
                c.data("spaceSelect", !1), this.$button.on("keyup", function(a) {
                    /(32)/.test(a.keyCode.toString(10)) && c.data("spaceSelect") && (a.preventDefault(), c.data("spaceSelect", !1))
                }), this.$button.on("click", function() {
                    b.setSize()
                }), this.$element.on("shown.bs.select", function() {
                    if (b.options.liveSearch || b.multiple) {
                        if (!b.multiple) {
                            var a = b.liObj[b.$element[0].selectedIndex];
                            if ("number" != typeof a || !1 === b.options.size) return;
                            var c = b.$lis.eq(a)[0].offsetTop - b.$menuInner[0].offsetTop;
                            c = c - b.$menuInner[0].offsetHeight / 2 + b.sizeInfo.liHeight / 2, b.$menuInner[0].scrollTop = c
                        }
                    } else b.$menuInner.find(".selected a").focus()
                }), this.$menuInner.on("click", "li a", function(c) {
                    var d = a(this),
                        f = d.parent().data("originalIndex"),
                        g = b.$element.val(),
                        h = b.$element.prop("selectedIndex"),
                        i = !0;
                    if (b.multiple && 1 !== b.options.maxOptions && c.stopPropagation(), c.preventDefault(), !b.isDisabled() && !d.parent().hasClass("disabled")) {
                        var j = b.$element.find("option"),
                            k = j.eq(f),
                            l = k.prop("selected"),
                            m = k.parent("optgroup"),
                            n = b.options.maxOptions,
                            o = m.data("maxOptions") || !1;
                        if (b.multiple) {
                            if (k.prop("selected", !l), b.setSelected(f, !l), d.blur(), !1 !== n || !1 !== o) {
                                var p = n < j.filter(":selected").length,
                                    q = o < m.find("option:selected").length;
                                if (n && p || o && q)
                                    if (n && 1 == n) j.prop("selected", !1), k.prop("selected", !0), b.$menuInner.find(".selected").removeClass("selected"), b.setSelected(f, !0);
                                    else if (o && 1 == o) {
                                    m.find("option:selected").prop("selected", !1), k.prop("selected", !0);
                                    var r = d.parent().data("optgroup");
                                    b.$menuInner.find('[data-optgroup="' + r + '"]').removeClass("selected"), b.setSelected(f, !0)
                                } else {
                                    var s = "string" == typeof b.options.maxOptionsText ? [b.options.maxOptionsText, b.options.maxOptionsText] : b.options.maxOptionsText,
                                        t = "function" == typeof s ? s(n, o) : s,
                                        u = t[0].replace("{n}", n),
                                        v = t[1].replace("{n}", o),
                                        w = a('<div class="notify"></div>');
                                    t[2] && (u = u.replace("{var}", t[2][n > 1 ? 0 : 1]), v = v.replace("{var}", t[2][o > 1 ? 0 : 1])), k.prop("selected", !1), b.$menu.append(w), n && p && (w.append(a("<div>" + u + "</div>")), i = !1, b.$element.trigger("maxReached.bs.select")), o && q && (w.append(a("<div>" + v + "</div>")), i = !1, b.$element.trigger("maxReachedGrp.bs.select")), setTimeout(function() {
                                        b.setSelected(f, !1)
                                    }, 10), w.delay(750).fadeOut(300, function() {
                                        a(this).remove()
                                    })
                                }
                            }
                        } else j.prop("selected", !1), k.prop("selected", !0), b.$menuInner.find(".selected").removeClass("selected").find("a").attr("aria-selected", !1), b.setSelected(f, !0);
                        !b.multiple || b.multiple && 1 === b.options.maxOptions ? b.$button.focus() : b.options.liveSearch && b.$searchbox.focus(), i && (g != b.$element.val() && b.multiple || h != b.$element.prop("selectedIndex") && !b.multiple) && (e = [f, k.prop("selected"), l], b.$element.triggerNative("change"))
                    }
                }), this.$menu.on("click", "li.disabled a, .popover-title, .popover-title :not(.close)", function(c) {
                    c.currentTarget == this && (c.preventDefault(), c.stopPropagation(), b.options.liveSearch && !a(c.target).hasClass("close") ? b.$searchbox.focus() : b.$button.focus())
                }), this.$menuInner.on("click", ".divider, .dropdown-header", function(a) {
                    a.preventDefault(), a.stopPropagation(), b.options.liveSearch ? b.$searchbox.focus() : b.$button.focus()
                }), this.$menu.on("click", ".popover-title .close", function() {
                    b.$button.click()
                }), this.$searchbox.on("click", function(a) {
                    a.stopPropagation()
                }), this.$menu.on("click", ".actions-btn", function(c) {
                    b.options.liveSearch ? b.$searchbox.focus() : b.$button.focus(), c.preventDefault(), c.stopPropagation(), a(this).hasClass("bs-select-all") ? b.selectAll() : b.deselectAll()
                }), this.$element.change(function() {
                    b.render(!1), b.$element.trigger("changed.bs.select", e), e = null
                })
            },
            liveSearchListener: function() {
                var c = this,
                    d = a('<li class="no-results"></li>');
                this.$button.on("click.dropdown.data-api", function() {
                    c.$menuInner.find(".active").removeClass("active"), c.$searchbox.val() && (c.$searchbox.val(""), c.$lis.not(".is-hidden").removeClass("hidden"), d.parent().length && d.remove()), c.multiple || c.$menuInner.find(".selected").addClass("active"), setTimeout(function() {
                        c.$searchbox.focus()
                    }, 10)
                }), this.$searchbox.on("click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api", function(a) {
                    a.stopPropagation()
                }), this.$searchbox.on("input propertychange", function() {
                    if (c.$lis.not(".is-hidden").removeClass("hidden"), c.$lis.filter(".active").removeClass("active"), d.remove(), c.$searchbox.val()) {
                        var e, f = c.$lis.not(".is-hidden, .divider, .dropdown-header");
                        if (e = c.options.liveSearchNormalize ? f.not(":a" + c._searchStyle() + '("' + b(c.$searchbox.val()) + '")') : f.not(":" + c._searchStyle() + '("' + c.$searchbox.val() + '")'), e.length === f.length) d.html(c.options.noneResultsText.replace("{0}", '"' + j(c.$searchbox.val()) + '"')), c.$menuInner.append(d), c.$lis.addClass("hidden");
                        else {
                            e.addClass("hidden");
                            var g, h = c.$lis.not(".hidden");
                            h.each(function(b) {
                                var c = a(this);
                                c.hasClass("divider") ? void 0 === g ? c.addClass("hidden") : (g && g.addClass("hidden"), g = c) : c.hasClass("dropdown-header") && h.eq(b + 1).data("optgroup") !== c.data("optgroup") ? c.addClass("hidden") : g = null
                            }), g && g.addClass("hidden"), f.not(".hidden").first().addClass("active"), c.$menuInner.scrollTop(0)
                        }
                    }
                })
            },
            _searchStyle: function() {
                return {
                    begins: "ibegins",
                    startsWith: "ibegins"
                }[this.options.liveSearchStyle] || "icontains"
            },
            val: function(a) {
                return void 0 !== a ? (this.$element.val(a), this.render(), this.$element) : this.$element.val()
            },
            changeAll: function(b) {
                if (this.multiple) {
                    void 0 === b && (b = !0), this.findLis();
                    var c = this.$element.find("option"),
                        d = this.$lis.not(".divider, .dropdown-header, .disabled, .hidden"),
                        e = d.length,
                        f = [];
                    if (b) {
                        if (d.filter(".selected").length === d.length) return
                    } else if (0 === d.filter(".selected").length) return;
                    d.toggleClass("selected", b);
                    for (var g = 0; g < e; g++) {
                        var h = d[g].getAttribute("data-original-index");
                        f[f.length] = c.eq(h)[0]
                    }
                    a(f).prop("selected", b), this.render(!1), this.togglePlaceholder(), this.$element.triggerNative("change")
                }
            },
            selectAll: function() {
                return this.changeAll(!0)
            },
            deselectAll: function() {
                return this.changeAll(!1)
            },
            toggle: function(a) {
                a = a || window.event, a && a.stopPropagation(), this.$button.trigger("click")
            },
            keydown: function(b) {
                var c, d, e, f, g = a(this),
                    h = g.is("input") ? g.parent().parent() : g.parent(),
                    i = h.data("this"),
                    j = ":not(.disabled, .hidden, .dropdown-header, .divider)",
                    k = {
                        32: " ",
                        48: "0",
                        49: "1",
                        50: "2",
                        51: "3",
                        52: "4",
                        53: "5",
                        54: "6",
                        55: "7",
                        56: "8",
                        57: "9",
                        59: ";",
                        65: "a",
                        66: "b",
                        67: "c",
                        68: "d",
                        69: "e",
                        70: "f",
                        71: "g",
                        72: "h",
                        73: "i",
                        74: "j",
                        75: "k",
                        76: "l",
                        77: "m",
                        78: "n",
                        79: "o",
                        80: "p",
                        81: "q",
                        82: "r",
                        83: "s",
                        84: "t",
                        85: "u",
                        86: "v",
                        87: "w",
                        88: "x",
                        89: "y",
                        90: "z",
                        96: "0",
                        97: "1",
                        98: "2",
                        99: "3",
                        100: "4",
                        101: "5",
                        102: "6",
                        103: "7",
                        104: "8",
                        105: "9"
                    };
                if (!(f = i.$newElement.hasClass("open")) && (b.keyCode >= 48 && b.keyCode <= 57 || b.keyCode >= 96 && b.keyCode <= 105 || b.keyCode >= 65 && b.keyCode <= 90)) return i.options.container ? i.$button.trigger("click") : (i.setSize(), i.$menu.parent().addClass("open"), f = !0), void i.$searchbox.focus();
                if (i.options.liveSearch && /(^9$|27)/.test(b.keyCode.toString(10)) && f && (b.preventDefault(), b.stopPropagation(), i.$menuInner.click(), i.$button.focus()), /(38|40)/.test(b.keyCode.toString(10))) {
                    if (c = i.$lis.filter(j), !c.length) return;
                    d = i.options.liveSearch ? c.index(c.filter(".active")) : c.index(c.find("a").filter(":focus").parent()), e = i.$menuInner.data("prevIndex"), 38 == b.keyCode ? (!i.options.liveSearch && d != e || -1 == d || d--, d < 0 && (d += c.length)) : 40 == b.keyCode && ((i.options.liveSearch || d == e) && d++, d %= c.length), i.$menuInner.data("prevIndex", d), i.options.liveSearch ? (b.preventDefault(), g.hasClass("dropdown-toggle") || (c.removeClass("active").eq(d).addClass("active").children("a").focus(), g.focus())) : c.eq(d).children("a").focus()
                } else if (!g.is("input")) {
                    var l, m, n = [];
                    c = i.$lis.filter(j), c.each(function(c) {
                        a.trim(a(this).children("a").text().toLowerCase()).substring(0, 1) == k[b.keyCode] && n.push(c)
                    }), l = a(document).data("keycount"), l++, a(document).data("keycount", l), m = a.trim(a(":focus").text().toLowerCase()).substring(0, 1), m != k[b.keyCode] ? (l = 1, a(document).data("keycount", l)) : l >= n.length && (a(document).data("keycount", 0), l > n.length && (l = 1)), c.eq(n[l - 1]).children("a").focus()
                }
                if ((/(13|32)/.test(b.keyCode.toString(10)) || /(^9$)/.test(b.keyCode.toString(10)) && i.options.selectOnTab) && f) {
                    if (/(32)/.test(b.keyCode.toString(10)) || b.preventDefault(), i.options.liveSearch) /(32)/.test(b.keyCode.toString(10)) || (i.$menuInner.find(".active a").click(), g.focus());
                    else {
                        var o = a(":focus");
                        o.click(), o.focus(), b.preventDefault(), a(document).data("spaceSelect", !0)
                    }
                    a(document).data("keycount", 0)
                }(/(^9$|27)/.test(b.keyCode.toString(10)) && f && (i.multiple || i.options.liveSearch) || /(27)/.test(b.keyCode.toString(10)) && !f) && (i.$menu.parent().removeClass("open"), i.options.container && i.$newElement.removeClass("open"), i.$button.focus())
            },
            mobile: function() {
                this.$element.addClass("mobile-device")
            },
            refresh: function() {
                this.$lis = null, this.liObj = {}, this.reloadLi(), this.render(), this.checkDisabled(), this.liHeight(!0), this.setStyle(), this.setWidth(), this.$lis && this.$searchbox.trigger("propertychange"), this.$element.trigger("refreshed.bs.select")
            },
            hide: function() {
                this.$newElement.hide()
            },
            show: function() {
                this.$newElement.show()
            },
            remove: function() {
                this.$newElement.remove(), this.$element.remove()
            },
            destroy: function() {
                this.$newElement.before(this.$element).remove(), this.$bsContainer ? this.$bsContainer.remove() : this.$menu.remove(), this.$element.off(".bs.select").removeData("selectpicker").removeClass("bs-select-hidden selectpicker")
            }
        };
        var m = a.fn.selectpicker;
        a.fn.selectpicker = c, a.fn.selectpicker.Constructor = l, a.fn.selectpicker.noConflict = function() {
            return a.fn.selectpicker = m, this
        }, a(document).data("keycount", 0).on("keydown.bs.select", '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', l.prototype.keydown).on("focusin.modal", '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', function(a) {
            a.stopPropagation()
        }), a(window).on("load.bs.select.data-api", function() {
            a(".selectpicker").each(function() {
                var b = a(this);
                c.call(b, b.data())
            })
        })
    }(a)
}),
function(a) {
    a.fn.extend({
        slimScroll: function(b) {
            var c = {
                    width: "auto",
                    height: "250px",
                    size: "7px",
                    color: "#000",
                    position: "right",
                    distance: "1px",
                    start: "top",
                    opacity: .4,
                    alwaysVisible: !1,
                    disableFadeOut: !1,
                    railVisible: !1,
                    railColor: "#333",
                    railOpacity: .2,
                    railDraggable: !0,
                    railClass: "slimScrollRail",
                    barClass: "slimScrollBar",
                    wrapperClass: "slimScrollDiv",
                    allowPageScroll: !1,
                    wheelStep: 20,
                    touchScrollStep: 200,
                    borderRadius: "0",
                    railBorderRadius: "0"
                },
                d = a.extend(c, b);
            return this.each(function() {
                function c(b) {
                    if (i) {
                        var b = b || window.event,
                            c = 0;
                        b.wheelDelta && (c = -b.wheelDelta / 120), b.detail && (c = b.detail / 3);
                        var f = b.target || b.srcTarget || b.srcElement;
                        a(f).closest("." + d.wrapperClass).is(u.parent()) && e(c, !0), b.preventDefault && !s && b.preventDefault(), s || (b.returnValue = !1)
                    }
                }

                function e(a, b, c) {
                    s = !1;
                    var e = a,
                        f = u.outerHeight() - z.outerHeight();
                    if (b && (e = parseInt(z.css("top")) + a * parseInt(d.wheelStep) / 100 * z.outerHeight(), e = Math.min(Math.max(e, 0), f), e = a > 0 ? Math.ceil(e) : Math.floor(e), z.css({
                            top: e + "px"
                        })), o = parseInt(z.css("top")) / (u.outerHeight() - z.outerHeight()), e = o * (u[0].scrollHeight - u.outerHeight()), c) {
                        e = a;
                        var i = e / u[0].scrollHeight * u.outerHeight();
                        i = Math.min(Math.max(i, 0), f), z.css({
                            top: i + "px"
                        })
                    }
                    u.scrollTop(e), u.trigger("slimscrolling", ~~e), g(), h()
                }

                function f() {
                    n = Math.max(u.outerHeight() / u[0].scrollHeight * u.outerHeight(), r), z.css({
                        height: n + "px"
                    });
                    var a = n == u.outerHeight() ? "none" : "block";
                    z.css({
                        display: a
                    })
                }

                function g() {
                    if (f(), clearTimeout(l), o == ~~o) {
                        if (s = d.allowPageScroll, p != o) {
                            var a = 0 == ~~o ? "top" : "bottom";
                            u.trigger("slimscroll", a)
                        }
                    } else s = !1;
                    if (p = o, n >= u.outerHeight()) return void(s = !0);
                    z.stop(!0, !0).fadeIn("fast"), d.railVisible && y.stop(!0, !0).fadeIn("fast")
                }

                function h() {
                    d.alwaysVisible || (l = setTimeout(function() {
                        d.disableFadeOut && i || j || k || (z.fadeOut("slow"), y.fadeOut("slow"))
                    }, 1e3))
                }
                var i, j, k, l, m, n, o, p, q = "<div></div>",
                    r = 30,
                    s = !1,
                    u = a(this);
                if (u.parent().hasClass(d.wrapperClass)) {
                    var v = u.scrollTop();
                    if (z = u.closest("." + d.barClass), y = u.closest("." + d.railClass), f(), a.isPlainObject(b)) {
                        if ("height" in b && "auto" == b.height) {
                            u.parent().css("height", "auto"), u.css("height", "auto");
                            var w = u.parent().parent().height();
                            u.parent().css("height", w), u.css("height", w)
                        }
                        if ("scrollTo" in b) v = parseInt(d.scrollTo);
                        else if ("scrollBy" in b) v += parseInt(d.scrollBy);
                        else if ("destroy" in b) return z.remove(), y.remove(), void u.unwrap();
                        e(v, !1, !0)
                    }
                } else if (!(a.isPlainObject(b) && "destroy" in b)) {
                    d.height = "auto" == d.height ? u.parent().height() : d.height;
                    var x = a(q).addClass(d.wrapperClass).css({
                        position: "relative",
                        overflow: "hidden",
                        width: d.width,
                        height: d.height
                    });
                    u.css({
                        overflow: "hidden",
                        width: d.width,
                        height: d.height
                    });
                    var y = a(q).addClass(d.railClass).css({
                            width: d.size,
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            display: d.alwaysVisible && d.railVisible ? "block" : "none",
                            "border-radius": d.railBorderRadius,
                            background: d.railColor,
                            opacity: d.railOpacity,
                            zIndex: 90
                        }),
                        z = a(q).addClass(d.barClass).css({
                            background: d.color,
                            width: d.size,
                            position: "absolute",
                            top: 0,
                            opacity: d.opacity,
                            display: d.alwaysVisible ? "block" : "none",
                            "border-radius": d.borderRadius,
                            BorderRadius: d.borderRadius,
                            MozBorderRadius: d.borderRadius,
                            WebkitBorderRadius: d.borderRadius,
                            zIndex: 99
                        }),
                        A = "right" == d.position ? {
                            right: d.distance
                        } : {
                            left: d.distance
                        };
                    y.css(A), z.css(A), u.wrap(x), u.parent().append(z), u.parent().append(y), d.railDraggable && z.bind("mousedown", function(b) {
                            var c = a(document);
                            return k = !0, t = parseFloat(z.css("top")), pageY = b.pageY, c.bind("mousemove.slimscroll", function(a) {
                                currTop = t + a.pageY - pageY, z.css("top", currTop), e(0, z.position().top, !1)
                            }), c.bind("mouseup.slimscroll", function(a) {
                                k = !1, h(), c.unbind(".slimscroll")
                            }), !1
                        }).bind("selectstart.slimscroll", function(a) {
                            return a.stopPropagation(), a.preventDefault(), !1
                        }), y.hover(function() {
                            g()
                        }, function() {
                            h()
                        }), z.hover(function() {
                            j = !0
                        }, function() {
                            j = !1
                        }), u.hover(function() {
                            i = !0, g(), h()
                        }, function() {
                            i = !1, h()
                        }), u.bind("touchstart", function(a, b) {
                            a.originalEvent.touches.length && (m = a.originalEvent.touches[0].pageY)
                        }), u.bind("touchmove", function(a) {
                            if (s || a.originalEvent.preventDefault(), a.originalEvent.touches.length) {
                                e((m - a.originalEvent.touches[0].pageY) / d.touchScrollStep, !0), m = a.originalEvent.touches[0].pageY
                            }
                        }), f(), "bottom" === d.start ? (z.css({
                            top: u.outerHeight() - z.outerHeight()
                        }), e(0, !0)) : "top" !== d.start && (e(a(d.start).position().top, null, !0), d.alwaysVisible || z.hide()),
                        function(a) {
                            window.addEventListener ? (a.addEventListener("DOMMouseScroll", c, !1), a.addEventListener("mousewheel", c, !1)) : document.attachEvent("onmousewheel", c)
                        }(this)
                }
            }), this
        }
    }), a.fn.extend({
        slimscroll: a.fn.slimScroll
    })
}(jQuery),
function(a, b) {
    "use strict";
    "function" == typeof define && define.amd ? define([], function() {
        return b.apply(a)
    }) : "object" == typeof exports ? module.exports = b.call(a) : a.Waves = b.call(a)
}("object" == typeof global ? global : this, function() {
    "use strict";

    function a(a) {
        return null !== a && a === a.window
    }

    function b(b) {
        return a(b) ? b : 9 === b.nodeType && b.defaultView
    }

    function c(a) {
        var b = typeof a;
        return "function" === b || "object" === b && !!a
    }

    function d(a) {
        return c(a) && a.nodeType > 0
    }

    function e(a) {
        var b = m.call(a);
        return "[object String]" === b ? l(a) : c(a) && /^\[object (Array|HTMLCollection|NodeList|Object)\]$/.test(b) && a.hasOwnProperty("length") ? a : d(a) ? [a] : []
    }

    function f(a) {
        var c, d, e = {
                top: 0,
                left: 0
            },
            f = a && a.ownerDocument;
        return c = f.documentElement, void 0 !== a.getBoundingClientRect && (e = a.getBoundingClientRect()), d = b(f), {
            top: e.top + d.pageYOffset - c.clientTop,
            left: e.left + d.pageXOffset - c.clientLeft
        }
    }

    function g(a) {
        var b = "";
        for (var c in a) a.hasOwnProperty(c) && (b += c + ":" + a[c] + ";");
        return b
    }

    function h(a, b, c) {
        if (c) {
            c.classList.remove("waves-rippling");
            var d = c.getAttribute("data-x"),
                e = c.getAttribute("data-y"),
                f = c.getAttribute("data-scale"),
                h = c.getAttribute("data-translate"),
                i = Date.now() - Number(c.getAttribute("data-hold")),
                j = 350 - i;
            j < 0 && (j = 0), "mousemove" === a.type && (j = 150);
            var k = "mousemove" === a.type ? 2500 : o.duration;
            setTimeout(function() {
                var a = {
                    top: e + "px",
                    left: d + "px",
                    opacity: "0",
                    "-webkit-transition-duration": k + "ms",
                    "-moz-transition-duration": k + "ms",
                    "-o-transition-duration": k + "ms",
                    "transition-duration": k + "ms",
                    "-webkit-transform": f + " " + h,
                    "-moz-transform": f + " " + h,
                    "-ms-transform": f + " " + h,
                    "-o-transform": f + " " + h,
                    transform: f + " " + h
                };
                c.setAttribute("style", g(a)), setTimeout(function() {
                    try {
                        b.removeChild(c)
                    } catch (a) {
                        return !1
                    }
                }, k)
            }, j)
        }
    }

    function i(a) {
        if (!1 === q.allowEvent(a)) return null;
        for (var b = null, c = a.target || a.srcElement; null !== c.parentElement;) {
            if (c.classList.contains("waves-effect") && !(c instanceof SVGElement)) {
                b = c;
                break
            }
            c = c.parentElement
        }
        return b
    }

    function j(a) {
        var b = i(a);
        if (null !== b) {
            if (b.disabled || b.getAttribute("disabled") || b.classList.contains("disabled")) return;
            if (q.registerEvent(a), "touchstart" === a.type && o.delay) {
                var c = !1,
                    d = setTimeout(function() {
                        d = null, o.show(a, b)
                    }, o.delay),
                    e = function(e) {
                        d && (clearTimeout(d), d = null, o.show(a, b)), c || (c = !0, o.hide(e, b))
                    },
                    f = function(a) {
                        d && (clearTimeout(d), d = null), e(a)
                    };
                b.addEventListener("touchmove", f, !1), b.addEventListener("touchend", e, !1), b.addEventListener("touchcancel", e, !1)
            } else o.show(a, b), n && (b.addEventListener("touchend", o.hide, !1), b.addEventListener("touchcancel", o.hide, !1)), b.addEventListener("mouseup", o.hide, !1), b.addEventListener("mouseleave", o.hide, !1)
        }
    }
    var k = k || {},
        l = document.querySelectorAll.bind(document),
        m = Object.prototype.toString,
        n = "ontouchstart" in window,
        o = {
            duration: 750,
            delay: 200,
            show: function(a, b, c) {
                if (2 === a.button) return !1;
                b = b || this;
                var d = document.createElement("div");
                d.className = "waves-ripple waves-rippling", b.appendChild(d);
                var e = f(b),
                    h = 0,
                    i = 0;
                "touches" in a && a.touches.length ? (h = a.touches[0].pageY - e.top, i = a.touches[0].pageX - e.left) : (h = a.pageY - e.top, i = a.pageX - e.left), i = i >= 0 ? i : 0, h = h >= 0 ? h : 0;
                var j = "scale(" + b.clientWidth / 100 * 3 + ")",
                    k = "translate(0,0)";
                c && (k = "translate(" + c.x + "px, " + c.y + "px)"), d.setAttribute("data-hold", Date.now()), d.setAttribute("data-x", i), d.setAttribute("data-y", h), d.setAttribute("data-scale", j), d.setAttribute("data-translate", k);
                var l = {
                    top: h + "px",
                    left: i + "px"
                };
                d.classList.add("waves-notransition"), d.setAttribute("style", g(l)), d.classList.remove("waves-notransition"), l["-webkit-transform"] = j + " " + k, l["-moz-transform"] = j + " " + k, l["-ms-transform"] = j + " " + k, l["-o-transform"] = j + " " + k, l.transform = j + " " + k, l.opacity = "1";
                var m = "mousemove" === a.type ? 2500 : o.duration;
                l["-webkit-transition-duration"] = m + "ms", l["-moz-transition-duration"] = m + "ms", l["-o-transition-duration"] = m + "ms", l["transition-duration"] = m + "ms", d.setAttribute("style", g(l))
            },
            hide: function(a, b) {
                b = b || this;
                for (var c = b.getElementsByClassName("waves-rippling"), d = 0, e = c.length; d < e; d++) h(a, b, c[d])
            }
        },
        p = {
            input: function(a) {
                var b = a.parentNode;
                if ("i" !== b.tagName.toLowerCase() || !b.classList.contains("waves-effect")) {
                    var c = document.createElement("i");
                    c.className = a.className + " waves-input-wrapper", a.className = "waves-button-input", b.replaceChild(c, a), c.appendChild(a);
                    var d = window.getComputedStyle(a, null),
                        e = d.color,
                        f = d.backgroundColor;
                    c.setAttribute("style", "color:" + e + ";background:" + f), a.setAttribute("style", "background-color:rgba(0,0,0,0);")
                }
            },
            img: function(a) {
                var b = a.parentNode;
                if ("i" !== b.tagName.toLowerCase() || !b.classList.contains("waves-effect")) {
                    var c = document.createElement("i");
                    b.replaceChild(c, a), c.appendChild(a)
                }
            }
        },
        q = {
            touches: 0,
            allowEvent: function(a) {
                var b = !0;
                return /^(mousedown|mousemove)$/.test(a.type) && q.touches && (b = !1), b
            },
            registerEvent: function(a) {
                var b = a.type;
                "touchstart" === b ? q.touches += 1 : /^(touchend|touchcancel)$/.test(b) && setTimeout(function() {
                    q.touches && (q.touches -= 1)
                }, 500)
            }
        };
    return k.init = function(a) {
        var b = document.body;
        a = a || {}, "duration" in a && (o.duration = a.duration), "delay" in a && (o.delay = a.delay), n && (b.addEventListener("touchstart", j, !1), b.addEventListener("touchcancel", q.registerEvent, !1), b.addEventListener("touchend", q.registerEvent, !1)), b.addEventListener("mousedown", j, !1)
    }, k.attach = function(a, b) {
        a = e(a), "[object Array]" === m.call(b) && (b = b.join(" ")), b = b ? " " + b : "";
        for (var c, d, f = 0, g = a.length; f < g; f++) c = a[f], d = c.tagName.toLowerCase(), -1 !== ["input", "img"].indexOf(d) && (p[d](c), c = c.parentElement), -1 === c.className.indexOf("waves-effect") && (c.className += " waves-effect" + b)
    }, k.ripple = function(a, b) {
        a = e(a);
        var c = a.length;
        if (b = b || {}, b.wait = b.wait || 0, b.position = b.position || null, c)
            for (var d, g, h, i = {}, j = 0, k = {
                    type: "mousedown",
                    button: 1
                }; j < c; j++)
                if (d = a[j], g = b.position || {
                        x: d.clientWidth / 2,
                        y: d.clientHeight / 2
                    }, h = f(d), i.x = h.left + g.x, i.y = h.top + g.y, k.pageX = i.x, k.pageY = i.y, o.show(k, d), b.wait >= 0 && null !== b.wait) {
                    var l = {
                        type: "mouseup",
                        button: 1
                    };
                    setTimeout(function(a, b) {
                        return function() {
                            o.hide(a, b)
                        }
                    }(l, d), b.wait)
                }
    }, k.calm = function(a) {
        a = e(a);
        for (var b = {
                type: "mouseup",
                button: 1
            }, c = 0, d = a.length; c < d; c++) o.hide(b, a[c])
    }, k.displayEffect = function(a) {
        console.error("Waves.displayEffect() has been deprecated and will be removed in future version. Please use Waves.init() to initialize Waves effect"), k.init(a)
    }, k
}),
function(a, b, c) {
    ! function(a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : jQuery && !jQuery.fn.sparkline && a(jQuery)
    }(function(c) {
        "use strict";
        var d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I = {},
            J = 0;
        d = function() {
            return {
                common: {
                    type: "line",
                    lineColor: "#00f",
                    fillColor: "#cdf",
                    defaultPixelsPerValue: 3,
                    width: "auto",
                    height: "auto",
                    composite: !1,
                    tagValuesAttribute: "values",
                    tagOptionsPrefix: "spark",
                    enableTagOptions: !1,
                    enableHighlight: !0,
                    highlightLighten: 1.4,
                    tooltipSkipNull: !0,
                    tooltipPrefix: "",
                    tooltipSuffix: "",
                    disableHiddenCheck: !1,
                    numberFormatter: !1,
                    numberDigitGroupCount: 3,
                    numberDigitGroupSep: ",",
                    numberDecimalMark: ".",
                    disableTooltips: !1,
                    disableInteraction: !1
                },
                line: {
                    spotColor: "#f80",
                    highlightSpotColor: "#5f5",
                    highlightLineColor: "#f22",
                    spotRadius: 1.5,
                    minSpotColor: "#f80",
                    maxSpotColor: "#f80",
                    lineWidth: 1,
                    normalRangeMin: void 0,
                    normalRangeMax: void 0,
                    normalRangeColor: "#ccc",
                    drawNormalOnTop: !1,
                    chartRangeMin: void 0,
                    chartRangeMax: void 0,
                    chartRangeMinX: void 0,
                    chartRangeMaxX: void 0,
                    tooltipFormat: new f('<span style="color: {{color}}">&#9679;</span> {{prefix}}{{y}}{{suffix}}')
                },
                bar: {
                    barColor: "#3366cc",
                    negBarColor: "#f44",
                    stackedBarColor: ["#3366cc", "#dc3912", "#ff9900", "#109618", "#66aa00", "#dd4477", "#0099c6", "#990099"],
                    zeroColor: void 0,
                    nullColor: void 0,
                    zeroAxis: !0,
                    barWidth: 4,
                    barSpacing: 1,
                    chartRangeMax: void 0,
                    chartRangeMin: void 0,
                    chartRangeClip: !1,
                    colorMap: void 0,
                    tooltipFormat: new f('<span style="color: {{color}}">&#9679;</span> {{prefix}}{{value}}{{suffix}}')
                },
                tristate: {
                    barWidth: 4,
                    barSpacing: 1,
                    posBarColor: "#6f6",
                    negBarColor: "#f44",
                    zeroBarColor: "#999",
                    colorMap: {},
                    tooltipFormat: new f('<span style="color: {{color}}">&#9679;</span> {{value:map}}'),
                    tooltipValueLookups: {
                        map: {
                            "-1": "Loss",
                            0: "Draw",
                            1: "Win"
                        }
                    }
                },
                discrete: {
                    lineHeight: "auto",
                    thresholdColor: void 0,
                    thresholdValue: 0,
                    chartRangeMax: void 0,
                    chartRangeMin: void 0,
                    chartRangeClip: !1,
                    tooltipFormat: new f("{{prefix}}{{value}}{{suffix}}")
                },
                bullet: {
                    targetColor: "#f33",
                    targetWidth: 3,
                    performanceColor: "#33f",
                    rangeColors: ["#d3dafe", "#a8b6ff", "#7f94ff"],
                    base: void 0,
                    tooltipFormat: new f("{{fieldkey:fields}} - {{value}}"),
                    tooltipValueLookups: {
                        fields: {
                            r: "Range",
                            p: "Performance",
                            t: "Target"
                        }
                    }
                },
                pie: {
                    offset: 0,
                    sliceColors: ["#3366cc", "#dc3912", "#ff9900", "#109618", "#66aa00", "#dd4477", "#0099c6", "#990099"],
                    borderWidth: 0,
                    borderColor: "#000",
                    tooltipFormat: new f('<span style="color: {{color}}">&#9679;</span> {{value}} ({{percent.1}}%)')
                },
                box: {
                    raw: !1,
                    boxLineColor: "#000",
                    boxFillColor: "#cdf",
                    whiskerColor: "#000",
                    outlierLineColor: "#333",
                    outlierFillColor: "#fff",
                    medianColor: "#f00",
                    showOutliers: !0,
                    outlierIQR: 1.5,
                    spotRadius: 1.5,
                    target: void 0,
                    targetColor: "#4a2",
                    chartRangeMax: void 0,
                    chartRangeMin: void 0,
                    tooltipFormat: new f("{{field:fields}}: {{value}}"),
                    tooltipFormatFieldlistKey: "field",
                    tooltipValueLookups: {
                        fields: {
                            lq: "Lower Quartile",
                            med: "Median",
                            uq: "Upper Quartile",
                            lo: "Left Outlier",
                            ro: "Right Outlier",
                            lw: "Left Whisker",
                            rw: "Right Whisker"
                        }
                    }
                }
            }
        }, B = '.jqstooltip { position: absolute;left: 0px;top: 0px;visibility: hidden;background: rgb(0, 0, 0) transparent;background-color: rgba(0,0,0,0.6);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);-ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";color: white;font: 10px arial, san serif;text-align: left;white-space: nowrap;padding: 5px;border: 1px solid white;box-sizing: content-box;z-index: 10000;}.jqsfield { color: white;font: 10px arial, san serif;text-align: left;}', e = function() {
            var a, b;
            return a = function() {
                this.init.apply(this, arguments)
            }, arguments.length > 1 ? (arguments[0] ? (a.prototype = c.extend(new arguments[0], arguments[arguments.length - 1]), a._super = arguments[0].prototype) : a.prototype = arguments[arguments.length - 1], arguments.length > 2 && (b = Array.prototype.slice.call(arguments, 1, -1), b.unshift(a.prototype), c.extend.apply(c, b))) : a.prototype = arguments[0], a.prototype.cls = a, a
        }, c.SPFormatClass = f = e({
            fre: /\{\{([\w.]+?)(:(.+?))?\}\}/g,
            precre: /(\w+)\.(\d+)/,
            init: function(a, b) {
                this.format = a, this.fclass = b
            },
            render: function(a, b, c) {
                var d, e, f, g, h, i = this,
                    j = a;
                return this.format.replace(this.fre, function() {
                    var a;
                    return e = arguments[1], f = arguments[3], d = i.precre.exec(e), d ? (h = d[2], e = d[1]) : h = !1, void 0 === (g = j[e]) ? "" : f && b && b[f] ? (a = b[f], a.get ? b[f].get(g) || g : b[f][g] || g) : (l(g) && (g = c.get("numberFormatter") ? c.get("numberFormatter")(g) : p(g, h, c.get("numberDigitGroupCount"), c.get("numberDigitGroupSep"), c.get("numberDecimalMark"))), g)
                })
            }
        }), c.spformat = function(a, b) {
            return new f(a, b)
        }, g = function(a, b, c) {
            return a < b ? b : a > c ? c : a
        }, h = function(a, c) {
            var d;
            return 2 === c ? (d = b.floor(a.length / 2), a.length % 2 ? a[d] : (a[d - 1] + a[d]) / 2) : a.length % 2 ? (d = (a.length * c + c) / 4, d % 1 ? (a[b.floor(d)] + a[b.floor(d) - 1]) / 2 : a[d - 1]) : (d = (a.length * c + 2) / 4, d % 1 ? (a[b.floor(d)] + a[b.floor(d) - 1]) / 2 : a[d - 1])
        }, i = function(a) {
            var b;
            switch (a) {
                case "undefined":
                    a = void 0;
                    break;
                case "null":
                    a = null;
                    break;
                case "true":
                    a = !0;
                    break;
                case "false":
                    a = !1;
                    break;
                default:
                    b = parseFloat(a), a == b && (a = b)
            }
            return a
        }, j = function(a) {
            var b, c = [];
            for (b = a.length; b--;) c[b] = i(a[b]);
            return c
        }, k = function(a, b) {
            var c, d, e = [];
            for (c = 0, d = a.length; c < d; c++) a[c] !== b && e.push(a[c]);
            return e
        }, l = function(a) {
            return !isNaN(parseFloat(a)) && isFinite(a)
        }, p = function(a, b, d, e, f) {
            var g, h;
            for (a = (!1 === b ? parseFloat(a).toString() : a.toFixed(b)).split(""), g = (g = c.inArray(".", a)) < 0 ? a.length : g, g < a.length && (a[g] = f), h = g - d; h > 0; h -= d) a.splice(h, 0, e);
            return a.join("")
        }, m = function(a, b, c) {
            var d;
            for (d = b.length; d--;)
                if ((!c || null !== b[d]) && b[d] !== a) return !1;
            return !0
        }, o = function(a) {
            return c.isArray(a) ? a : [a]
        }, n = function(b) {
            var c, d;
            if (a.createStyleSheet) try {
                return void(a.createStyleSheet().cssText = b)
            } catch (a) {
                d = !0
            }
            c = a.createElement("style"), c.type = "text/css", a.getElementsByTagName("head")[0].appendChild(c), d ? a.styleSheets[a.styleSheets.length - 1].cssText = b : c["string" == typeof a.body.style.WebkitAppearance ? "innerText" : "innerHTML"] = b
        }, c.fn.simpledraw = function(b, d, e, f) {
            var g, h;
            if (e && (g = this.data("_jqs_vcanvas"))) return g;
            if (!1 === c.fn.sparkline.canvas) return !1;
            if (void 0 === c.fn.sparkline.canvas) {
                var i = a.createElement("canvas");
                if (i.getContext && i.getContext("2d")) c.fn.sparkline.canvas = function(a, b, c, d) {
                    return new F(a, b, c, d)
                };
                else {
                    if (!a.namespaces || a.namespaces.v) return c.fn.sparkline.canvas = !1, !1;
                    a.namespaces.add("v", "urn:schemas-microsoft-com:vml", "#default#VML"), c.fn.sparkline.canvas = function(a, b, c, d) {
                        return new G(a, b, c)
                    }
                }
            }
            return void 0 === b && (b = c(this).innerWidth()), void 0 === d && (d = c(this).innerHeight()), g = c.fn.sparkline.canvas(b, d, this, f), h = c(this).data("_jqs_mhandler"), h && h.registerCanvas(g), g
        }, c.fn.cleardraw = function() {
            var a = this.data("_jqs_vcanvas");
            a && a.reset()
        }, c.RangeMapClass = q = e({
            init: function(a) {
                var b, c, d = [];
                for (b in a) a.hasOwnProperty(b) && "string" == typeof b && b.indexOf(":") > -1 && (c = b.split(":"), c[0] = 0 === c[0].length ? -1 / 0 : parseFloat(c[0]), c[1] = 0 === c[1].length ? 1 / 0 : parseFloat(c[1]), c[2] = a[b], d.push(c));
                this.map = a, this.rangelist = d || !1
            },
            get: function(a) {
                var b, c, d, e = this.rangelist;
                if (void 0 !== (d = this.map[a])) return d;
                if (e)
                    for (b = e.length; b--;)
                        if (c = e[b], c[0] <= a && c[1] >= a) return c[2]
            }
        }), c.range_map = function(a) {
            return new q(a)
        }, r = e({
            init: function(a, b) {
                var d = c(a);
                this.$el = d, this.options = b, this.currentPageX = 0, this.currentPageY = 0, this.el = a, this.splist = [], this.tooltip = null, this.over = !1, this.displayTooltips = !b.get("disableTooltips"), this.highlightEnabled = !b.get("disableHighlight")
            },
            registerSparkline: function(a) {
                this.splist.push(a), this.over && this.updateDisplay()
            },
            registerCanvas: function(a) {
                var b = c(a.canvas);
                this.canvas = a, this.$canvas = b, b.mouseenter(c.proxy(this.mouseenter, this)), b.mouseleave(c.proxy(this.mouseleave, this)), b.click(c.proxy(this.mouseclick, this))
            },
            reset: function(a) {
                this.splist = [], this.tooltip && a && (this.tooltip.remove(), this.tooltip = void 0)
            },
            mouseclick: function(a) {
                var b = c.Event("sparklineClick");
                b.originalEvent = a, b.sparklines = this.splist, this.$el.trigger(b)
            },
            mouseenter: function(b) {
                c(a.body).unbind("mousemove.jqs"), c(a.body).bind("mousemove.jqs", c.proxy(this.mousemove, this)), this.over = !0, this.currentPageX = b.pageX, this.currentPageY = b.pageY, this.currentEl = b.target, !this.tooltip && this.displayTooltips && (this.tooltip = new s(this.options), this.tooltip.updatePosition(b.pageX, b.pageY)), this.updateDisplay()
            },
            mouseleave: function() {
                c(a.body).unbind("mousemove.jqs");
                var b, d, e = this.splist,
                    f = e.length,
                    g = !1;
                for (this.over = !1, this.currentEl = null, this.tooltip && (this.tooltip.remove(), this.tooltip = null), d = 0; d < f; d++) b = e[d], b.clearRegionHighlight() && (g = !0);
                g && this.canvas.render()
            },
            mousemove: function(a) {
                this.currentPageX = a.pageX, this.currentPageY = a.pageY, this.currentEl = a.target, this.tooltip && this.tooltip.updatePosition(a.pageX, a.pageY), this.updateDisplay()
            },
            updateDisplay: function() {
                var a, b, d, e, f, g = this.splist,
                    h = g.length,
                    i = !1,
                    j = this.$canvas.offset(),
                    k = this.currentPageX - j.left,
                    l = this.currentPageY - j.top;
                if (this.over) {
                    for (d = 0; d < h; d++) b = g[d], (e = b.setRegionHighlight(this.currentEl, k, l)) && (i = !0);
                    if (i) {
                        if (f = c.Event("sparklineRegionChange"), f.sparklines = this.splist, this.$el.trigger(f), this.tooltip) {
                            for (a = "", d = 0; d < h; d++) b = g[d], a += b.getCurrentRegionTooltip();
                            this.tooltip.setContent(a)
                        }
                        this.disableHighlight || this.canvas.render()
                    }
                    null === e && this.mouseleave()
                }
            }
        }), s = e({
            sizeStyle: "position: static !important;display: block !important;visibility: hidden !important;float: left !important;",
            init: function(b) {
                var d, e = b.get("tooltipClassname", "jqstooltip"),
                    f = this.sizeStyle;
                this.container = b.get("tooltipContainer") || a.body, this.tooltipOffsetX = b.get("tooltipOffsetX", 10), this.tooltipOffsetY = b.get("tooltipOffsetY", 12), c("#jqssizetip").remove(), c("#jqstooltip").remove(), this.sizetip = c("<div/>", {
                    id: "jqssizetip",
                    style: f,
                    class: e
                }), this.tooltip = c("<div/>", {
                    id: "jqstooltip",
                    class: e
                }).appendTo(this.container), d = this.tooltip.offset(), this.offsetLeft = d.left, this.offsetTop = d.top, this.hidden = !0, c(window).unbind("resize.jqs scroll.jqs"), c(window).bind("resize.jqs scroll.jqs", c.proxy(this.updateWindowDims, this)), this.updateWindowDims()
            },
            updateWindowDims: function() {
                this.scrollTop = c(window).scrollTop(), this.scrollLeft = c(window).scrollLeft(), this.scrollRight = this.scrollLeft + c(window).width(), this.updatePosition()
            },
            getSize: function(a) {
                this.sizetip.html(a).appendTo(this.container), this.width = this.sizetip.width() + 1, this.height = this.sizetip.height(), this.sizetip.remove()
            },
            setContent: function(a) {
                if (!a) return this.tooltip.css("visibility", "hidden"), void(this.hidden = !0);
                this.getSize(a), this.tooltip.html(a).css({
                    width: this.width,
                    height: this.height,
                    visibility: "visible"
                }), this.hidden && (this.hidden = !1, this.updatePosition())
            },
            updatePosition: function(a, b) {
                if (void 0 === a) {
                    if (void 0 === this.mousex) return;
                    a = this.mousex - this.offsetLeft, b = this.mousey - this.offsetTop
                } else this.mousex = a -= this.offsetLeft, this.mousey = b -= this.offsetTop;
                this.height && this.width && !this.hidden && (b -= this.height + this.tooltipOffsetY, a += this.tooltipOffsetX, b < this.scrollTop && (b = this.scrollTop), a < this.scrollLeft ? a = this.scrollLeft : a + this.width > this.scrollRight && (a = this.scrollRight - this.width), this.tooltip.css({
                    left: a,
                    top: b
                }))
            },
            remove: function() {
                this.tooltip.remove(), this.sizetip.remove(), this.sizetip = this.tooltip = void 0, c(window).unbind("resize.jqs scroll.jqs")
            }
        }), C = function() {
            n(B)
        }, c(C), H = [], c.fn.sparkline = function(b, d) {
            return this.each(function() {
                var e, f, g = new c.fn.sparkline.options(this, d),
                    h = c(this);
                if (e = function() {
                        var d, e, f, i, j, k, l;
                        if ("html" === b || void 0 === b ? (l = this.getAttribute(g.get("tagValuesAttribute")), void 0 !== l && null !== l || (l = h.html()), d = l.replace(/(^\s*<!--)|(-->\s*$)|\s+/g, "").split(",")) : d = b, e = "auto" === g.get("width") ? d.length * g.get("defaultPixelsPerValue") : g.get("width"), "auto" === g.get("height") ? g.get("composite") && c.data(this, "_jqs_vcanvas") || (i = a.createElement("span"), i.innerHTML = "a", h.html(i), f = c(i).innerHeight() || c(i).height(), c(i).remove(), i = null) : f = g.get("height"), g.get("disableInteraction") ? j = !1 : (j = c.data(this, "_jqs_mhandler"), j ? g.get("composite") || j.reset() : (j = new r(this, g), c.data(this, "_jqs_mhandler", j))), g.get("composite") && !c.data(this, "_jqs_vcanvas")) return void(c.data(this, "_jqs_errnotify") || (alert("Attempted to attach a composite sparkline to an element with no existing sparkline"), c.data(this, "_jqs_errnotify", !0)));
                        k = new(c.fn.sparkline[g.get("type")])(this, d, g, e, f), k.render(), j && j.registerSparkline(k)
                    }, c(this).html() && !g.get("disableHiddenCheck") && c(this).is(":hidden") || !c(this).parents("body").length) {
                    if (!g.get("composite") && c.data(this, "_jqs_pending"))
                        for (f = H.length; f; f--) H[f - 1][0] == this && H.splice(f - 1, 1);
                    H.push([this, e]), c.data(this, "_jqs_pending", !0)
                } else e.call(this)
            })
        }, c.fn.sparkline.defaults = d(), c.sparkline_display_visible = function() {
            var a, b, d, e = [];
            for (b = 0, d = H.length; b < d; b++) a = H[b][0], c(a).is(":visible") && !c(a).parents().is(":hidden") ? (H[b][1].call(a), c.data(H[b][0], "_jqs_pending", !1), e.push(b)) : c(a).closest("html").length || c.data(a, "_jqs_pending") || (c.data(H[b][0], "_jqs_pending", !1), e.push(b));
            for (b = e.length; b; b--) H.splice(e[b - 1], 1)
        }, c.fn.sparkline.options = e({
            init: function(a, b) {
                var d, e, f, g;
                this.userOptions = b = b || {}, this.tag = a, this.tagValCache = {}, e = c.fn.sparkline.defaults, f = e.common, this.tagOptionsPrefix = b.enableTagOptions && (b.tagOptionsPrefix || f.tagOptionsPrefix), g = this.getTagSetting("type"), d = g === I ? e[b.type || f.type] : e[g], this.mergedOptions = c.extend({}, f, d, b)
            },
            getTagSetting: function(a) {
                var b, c, d, e, f = this.tagOptionsPrefix;
                if (!1 === f || void 0 === f) return I;
                if (this.tagValCache.hasOwnProperty(a)) b = this.tagValCache.key;
                else {
                    if (void 0 === (b = this.tag.getAttribute(f + a)) || null === b) b = I;
                    else if ("[" === b.substr(0, 1))
                        for (b = b.substr(1, b.length - 2).split(","), c = b.length; c--;) b[c] = i(b[c].replace(/(^\s*)|(\s*$)/g, ""));
                    else if ("{" === b.substr(0, 1))
                        for (d = b.substr(1, b.length - 2).split(","), b = {}, c = d.length; c--;) e = d[c].split(":", 2), b[e[0].replace(/(^\s*)|(\s*$)/g, "")] = i(e[1].replace(/(^\s*)|(\s*$)/g, ""));
                    else b = i(b);
                    this.tagValCache.key = b
                }
                return b
            },
            get: function(a, b) {
                var c, d = this.getTagSetting(a);
                return d !== I ? d : void 0 === (c = this.mergedOptions[a]) ? b : c
            }
        }), c.fn.sparkline._base = e({
            disabled: !1,
            init: function(a, b, d, e, f) {
                this.el = a, this.$el = c(a), this.values = b, this.options = d, this.width = e, this.height = f, this.currentRegion = void 0
            },
            initTarget: function() {
                var a = !this.options.get("disableInteraction");
                (this.target = this.$el.simpledraw(this.width, this.height, this.options.get("composite"), a)) ? (this.canvasWidth = this.target.pixelWidth, this.canvasHeight = this.target.pixelHeight) : this.disabled = !0
            },
            render: function() {
                return !this.disabled || (this.el.innerHTML = "", !1)
            },
            getRegion: function(a, b) {},
            setRegionHighlight: function(a, b, c) {
                var d, e = this.currentRegion,
                    f = !this.options.get("disableHighlight");
                return b > this.canvasWidth || c > this.canvasHeight || b < 0 || c < 0 ? null : (d = this.getRegion(a, b, c), e !== d && (void 0 !== e && f && this.removeHighlight(), this.currentRegion = d, void 0 !== d && f && this.renderHighlight(), !0))
            },
            clearRegionHighlight: function() {
                return void 0 !== this.currentRegion && (this.removeHighlight(), this.currentRegion = void 0, !0)
            },
            renderHighlight: function() {
                this.changeHighlight(!0)
            },
            removeHighlight: function() {
                this.changeHighlight(!1)
            },
            changeHighlight: function(a) {},
            getCurrentRegionTooltip: function() {
                var a, b, d, e, g, h, i, j, k, l, m, n, o, p, q = this.options,
                    r = "",
                    s = [];
                if (void 0 === this.currentRegion) return "";
                if (a = this.getCurrentRegionFields(), m = q.get("tooltipFormatter")) return m(this, q, a);
                if (q.get("tooltipChartTitle") && (r += '<div class="jqs jqstitle">' + q.get("tooltipChartTitle") + "</div>\n"), !(b = this.options.get("tooltipFormat"))) return "";
                if (c.isArray(b) || (b = [b]), c.isArray(a) || (a = [a]), i = this.options.get("tooltipFormatFieldlist"), j = this.options.get("tooltipFormatFieldlistKey"), i && j) {
                    for (k = [], h = a.length; h--;) l = a[h][j], -1 != (p = c.inArray(l, i)) && (k[p] = a[h]);
                    a = k
                }
                for (d = b.length, o = a.length, h = 0; h < d; h++)
                    for (n = b[h], "string" == typeof n && (n = new f(n)), e = n.fclass || "jqsfield", p = 0; p < o; p++) a[p].isNull && q.get("tooltipSkipNull") || (c.extend(a[p], {
                        prefix: q.get("tooltipPrefix"),
                        suffix: q.get("tooltipSuffix")
                    }), g = n.render(a[p], q.get("tooltipValueLookups"), q), s.push('<div class="' + e + '">' + g + "</div>"));
                return s.length ? r + s.join("\n") : ""
            },
            getCurrentRegionFields: function() {},
            calcHighlightColor: function(a, c) {
                var d, e, f, h, i = c.get("highlightColor"),
                    j = c.get("highlightLighten");
                if (i) return i;
                if (j && (d = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(a) || /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(a))) {
                    for (f = [], e = 4 === a.length ? 16 : 1, h = 0; h < 3; h++) f[h] = g(b.round(parseInt(d[h + 1], 16) * e * j), 0, 255);
                    return "rgb(" + f.join(",") + ")"
                }
                return a
            }
        }), t = {
            changeHighlight: function(a) {
                var b, d = this.currentRegion,
                    e = this.target,
                    f = this.regionShapes[d];
                f && (b = this.renderRegion(d, a), c.isArray(b) || c.isArray(f) ? (e.replaceWithShapes(f, b), this.regionShapes[d] = c.map(b, function(a) {
                    return a.id
                })) : (e.replaceWithShape(f, b), this.regionShapes[d] = b.id))
            },
            render: function() {
                var a, b, d, e, f = this.values,
                    g = this.target,
                    h = this.regionShapes;
                if (this.cls._super.render.call(this)) {
                    for (d = f.length; d--;)
                        if (a = this.renderRegion(d))
                            if (c.isArray(a)) {
                                for (b = [], e = a.length; e--;) a[e].append(), b.push(a[e].id);
                                h[d] = b
                            } else a.append(), h[d] = a.id;
                    else h[d] = null;
                    g.render()
                }
            }
        }, c.fn.sparkline.line = u = e(c.fn.sparkline._base, {
            type: "line",
            init: function(a, b, c, d, e) {
                u._super.init.call(this, a, b, c, d, e), this.vertices = [], this.regionMap = [], this.xvalues = [], this.yvalues = [], this.yminmax = [], this.hightlightSpotId = null, this.lastShapeId = null, this.initTarget()
            },
            getRegion: function(a, b, c) {
                var d, e = this.regionMap;
                for (d = e.length; d--;)
                    if (null !== e[d] && b >= e[d][0] && b <= e[d][1]) return e[d][2]
            },
            getCurrentRegionFields: function() {
                var a = this.currentRegion;
                return {
                    isNull: null === this.yvalues[a],
                    x: this.xvalues[a],
                    y: this.yvalues[a],
                    color: this.options.get("lineColor"),
                    fillColor: this.options.get("fillColor"),
                    offset: a
                }
            },
            renderHighlight: function() {
                var a, b, c = this.currentRegion,
                    d = this.target,
                    e = this.vertices[c],
                    f = this.options,
                    g = f.get("spotRadius"),
                    h = f.get("highlightSpotColor"),
                    i = f.get("highlightLineColor");
                e && (g && h && (a = d.drawCircle(e[0], e[1], g, void 0, h), this.highlightSpotId = a.id, d.insertAfterShape(this.lastShapeId, a)), i && (b = d.drawLine(e[0], this.canvasTop, e[0], this.canvasTop + this.canvasHeight, i), this.highlightLineId = b.id, d.insertAfterShape(this.lastShapeId, b)))
            },
            removeHighlight: function() {
                var a = this.target;
                this.highlightSpotId && (a.removeShapeId(this.highlightSpotId), this.highlightSpotId = null), this.highlightLineId && (a.removeShapeId(this.highlightLineId), this.highlightLineId = null)
            },
            scanValues: function() {
                var a, c, d, e, f, g = this.values,
                    h = g.length,
                    i = this.xvalues,
                    j = this.yvalues,
                    k = this.yminmax;
                for (a = 0; a < h; a++) c = g[a], d = "string" == typeof g[a], e = "object" == typeof g[a] && g[a] instanceof Array, f = d && g[a].split(":"), d && 2 === f.length ? (i.push(Number(f[0])), j.push(Number(f[1])), k.push(Number(f[1]))) : e ? (i.push(c[0]), j.push(c[1]), k.push(c[1])) : (i.push(a), null === g[a] || "null" === g[a] ? j.push(null) : (j.push(Number(c)), k.push(Number(c))));
                this.options.get("xvalues") && (i = this.options.get("xvalues")), this.maxy = this.maxyorg = b.max.apply(b, k), this.miny = this.minyorg = b.min.apply(b, k), this.maxx = b.max.apply(b, i), this.minx = b.min.apply(b, i), this.xvalues = i, this.yvalues = j, this.yminmax = k
            },
            processRangeOptions: function() {
                var a = this.options,
                    b = a.get("normalRangeMin"),
                    c = a.get("normalRangeMax");
                void 0 !== b && (b < this.miny && (this.miny = b), c > this.maxy && (this.maxy = c)), void 0 !== a.get("chartRangeMin") && (a.get("chartRangeClip") || a.get("chartRangeMin") < this.miny) && (this.miny = a.get("chartRangeMin")), void 0 !== a.get("chartRangeMax") && (a.get("chartRangeClip") || a.get("chartRangeMax") > this.maxy) && (this.maxy = a.get("chartRangeMax")), void 0 !== a.get("chartRangeMinX") && (a.get("chartRangeClipX") || a.get("chartRangeMinX") < this.minx) && (this.minx = a.get("chartRangeMinX")), void 0 !== a.get("chartRangeMaxX") && (a.get("chartRangeClipX") || a.get("chartRangeMaxX") > this.maxx) && (this.maxx = a.get("chartRangeMaxX"))
            },
            drawNormalRange: function(a, c, d, e, f) {
                var g = this.options.get("normalRangeMin"),
                    h = this.options.get("normalRangeMax"),
                    i = c + b.round(d - d * ((h - this.miny) / f)),
                    j = b.round(d * (h - g) / f);
                this.target.drawRect(a, i, e, j, void 0, this.options.get("normalRangeColor")).append()
            },
            render: function() {
                var a, d, e, f, g, h, i, j, k, l, m, n, o, p, r, s, t, v, w, x, y, z, A, B, C, D = this.options,
                    E = this.target,
                    F = this.canvasWidth,
                    G = this.canvasHeight,
                    H = this.vertices,
                    I = D.get("spotRadius"),
                    J = this.regionMap;
                if (u._super.render.call(this) && (this.scanValues(), this.processRangeOptions(), A = this.xvalues, B = this.yvalues, this.yminmax.length && !(this.yvalues.length < 2))) {
                    for (f = g = 0, a = this.maxx - this.minx == 0 ? 1 : this.maxx - this.minx, d = this.maxy - this.miny == 0 ? 1 : this.maxy - this.miny, e = this.yvalues.length - 1, I && (F < 4 * I || G < 4 * I) && (I = 0), I && (y = D.get("highlightSpotColor") && !D.get("disableInteraction"), (y || D.get("minSpotColor") || D.get("spotColor") && B[e] === this.miny) && (G -= b.ceil(I)), (y || D.get("maxSpotColor") || D.get("spotColor") && B[e] === this.maxy) && (G -= b.ceil(I), f += b.ceil(I)), (y || (D.get("minSpotColor") || D.get("maxSpotColor")) && (B[0] === this.miny || B[0] === this.maxy)) && (g += b.ceil(I),
                            F -= b.ceil(I)), (y || D.get("spotColor") || D.get("minSpotColor") || D.get("maxSpotColor") && (B[e] === this.miny || B[e] === this.maxy)) && (F -= b.ceil(I))), G--, void 0 === D.get("normalRangeMin") || D.get("drawNormalOnTop") || this.drawNormalRange(g, f, G, F, d), i = [], j = [i], p = r = null, s = B.length, C = 0; C < s; C++) k = A[C], m = A[C + 1], l = B[C], n = g + b.round((k - this.minx) * (F / a)), o = C < s - 1 ? g + b.round((m - this.minx) * (F / a)) : F, r = n + (o - n) / 2, J[C] = [p || 0, r, C], p = r, null === l ? C && (null !== B[C - 1] && (i = [], j.push(i)), H.push(null)) : (l < this.miny && (l = this.miny), l > this.maxy && (l = this.maxy), i.length || i.push([n, f + G]), h = [n, f + b.round(G - G * ((l - this.miny) / d))], i.push(h), H.push(h));
                    for (t = [], v = [], w = j.length, C = 0; C < w; C++) i = j[C], i.length && (D.get("fillColor") && (i.push([i[i.length - 1][0], f + G]), v.push(i.slice(0)), i.pop()), i.length > 2 && (i[0] = [i[0][0], i[1][1]]), t.push(i));
                    for (w = v.length, C = 0; C < w; C++) E.drawShape(v[C], D.get("fillColor"), D.get("fillColor")).append();
                    for (void 0 !== D.get("normalRangeMin") && D.get("drawNormalOnTop") && this.drawNormalRange(g, f, G, F, d), w = t.length, C = 0; C < w; C++) E.drawShape(t[C], D.get("lineColor"), void 0, D.get("lineWidth")).append();
                    if (I && D.get("valueSpots"))
                        for (x = D.get("valueSpots"), void 0 === x.get && (x = new q(x)), C = 0; C < s; C++)(z = x.get(B[C])) && E.drawCircle(g + b.round((A[C] - this.minx) * (F / a)), f + b.round(G - G * ((B[C] - this.miny) / d)), I, void 0, z).append();
                    I && D.get("spotColor") && null !== B[e] && E.drawCircle(g + b.round((A[A.length - 1] - this.minx) * (F / a)), f + b.round(G - G * ((B[e] - this.miny) / d)), I, void 0, D.get("spotColor")).append(), this.maxy !== this.minyorg && (I && D.get("minSpotColor") && (k = A[c.inArray(this.minyorg, B)], E.drawCircle(g + b.round((k - this.minx) * (F / a)), f + b.round(G - G * ((this.minyorg - this.miny) / d)), I, void 0, D.get("minSpotColor")).append()), I && D.get("maxSpotColor") && (k = A[c.inArray(this.maxyorg, B)], E.drawCircle(g + b.round((k - this.minx) * (F / a)), f + b.round(G - G * ((this.maxyorg - this.miny) / d)), I, void 0, D.get("maxSpotColor")).append())), this.lastShapeId = E.getLastShapeId(), this.canvasTop = f, E.render()
                }
            }
        }), c.fn.sparkline.bar = v = e(c.fn.sparkline._base, t, {
            type: "bar",
            init: function(a, d, e, f, h) {
                var l, m, n, o, p, r, s, t, u, w, x, y, z, A, B, C, D, E, F, G, H, I, J = parseInt(e.get("barWidth"), 10),
                    K = parseInt(e.get("barSpacing"), 10),
                    L = e.get("chartRangeMin"),
                    M = e.get("chartRangeMax"),
                    N = e.get("chartRangeClip"),
                    O = 1 / 0,
                    P = -1 / 0;
                for (v._super.init.call(this, a, d, e, f, h), r = 0, s = d.length; r < s; r++) G = d[r], ((l = "string" == typeof G && G.indexOf(":") > -1) || c.isArray(G)) && (B = !0, l && (G = d[r] = j(G.split(":"))), G = k(G, null), m = b.min.apply(b, G), n = b.max.apply(b, G), m < O && (O = m), n > P && (P = n));
                this.stacked = B, this.regionShapes = {}, this.barWidth = J, this.barSpacing = K, this.totalBarWidth = J + K, this.width = f = d.length * J + (d.length - 1) * K, this.initTarget(), N && (z = void 0 === L ? -1 / 0 : L, A = void 0 === M ? 1 / 0 : M), p = [], o = B ? [] : p;
                var Q = [],
                    R = [];
                for (r = 0, s = d.length; r < s; r++)
                    if (B)
                        for (C = d[r], d[r] = F = [], Q[r] = 0, o[r] = R[r] = 0, D = 0, E = C.length; D < E; D++) null !== (G = F[D] = N ? g(C[D], z, A) : C[D]) && (G > 0 && (Q[r] += G), O < 0 && P > 0 ? G < 0 ? R[r] += b.abs(G) : o[r] += G : o[r] += b.abs(G - (G < 0 ? P : O)), p.push(G));
                    else G = N ? g(d[r], z, A) : d[r], null !== (G = d[r] = i(G)) && p.push(G);
                this.max = y = b.max.apply(b, p), this.min = x = b.min.apply(b, p), this.stackMax = P = B ? b.max.apply(b, Q) : y, this.stackMin = O = B ? b.min.apply(b, p) : x, void 0 !== e.get("chartRangeMin") && (e.get("chartRangeClip") || e.get("chartRangeMin") < x) && (x = e.get("chartRangeMin")), void 0 !== e.get("chartRangeMax") && (e.get("chartRangeClip") || e.get("chartRangeMax") > y) && (y = e.get("chartRangeMax")), this.zeroAxis = u = e.get("zeroAxis", !0), w = x <= 0 && y >= 0 && u ? 0 : 0 == u ? x : x > 0 ? x : y, this.xaxisOffset = w, t = B ? b.max.apply(b, o) + b.max.apply(b, R) : y - x, this.canvasHeightEf = u && x < 0 ? this.canvasHeight - 2 : this.canvasHeight - 1, x < w ? (I = B && y >= 0 ? P : y, (H = (I - w) / t * this.canvasHeight) !== b.ceil(H) && (this.canvasHeightEf -= 2, H = b.ceil(H))) : H = this.canvasHeight, this.yoffset = H, c.isArray(e.get("colorMap")) ? (this.colorMapByIndex = e.get("colorMap"), this.colorMapByValue = null) : (this.colorMapByIndex = null, this.colorMapByValue = e.get("colorMap"), this.colorMapByValue && void 0 === this.colorMapByValue.get && (this.colorMapByValue = new q(this.colorMapByValue))), this.range = t
            },
            getRegion: function(a, c, d) {
                var e = b.floor(c / this.totalBarWidth);
                return e < 0 || e >= this.values.length ? void 0 : e
            },
            getCurrentRegionFields: function() {
                var a, b, c = this.currentRegion,
                    d = o(this.values[c]),
                    e = [];
                for (b = d.length; b--;) a = d[b], e.push({
                    isNull: null === a,
                    value: a,
                    color: this.calcColor(b, a, c),
                    offset: c
                });
                return e
            },
            calcColor: function(a, b, d) {
                var e, f, g = this.colorMapByIndex,
                    h = this.colorMapByValue,
                    i = this.options;
                return e = this.stacked ? i.get("stackedBarColor") : b < 0 ? i.get("negBarColor") : i.get("barColor"), 0 === b && void 0 !== i.get("zeroColor") && (e = i.get("zeroColor")), h && (f = h.get(b)) ? e = f : g && g.length > d && (e = g[d]), c.isArray(e) ? e[a % e.length] : e
            },
            renderRegion: function(a, d) {
                var e, f, g, h, i, j, k, l, n, o, p = this.values[a],
                    q = this.options,
                    r = this.xaxisOffset,
                    s = [],
                    t = this.range,
                    u = this.stacked,
                    v = this.target,
                    w = a * this.totalBarWidth,
                    x = this.canvasHeightEf,
                    y = this.yoffset;
                if (p = c.isArray(p) ? p : [p], k = p.length, l = p[0], h = m(null, p), o = m(r, p, !0), h) return q.get("nullColor") ? (g = d ? q.get("nullColor") : this.calcHighlightColor(q.get("nullColor"), q), e = y > 0 ? y - 1 : y, v.drawRect(w, e, this.barWidth - 1, 0, g, g)) : void 0;
                for (i = y, j = 0; j < k; j++) {
                    if (l = p[j], u && l === r) {
                        if (!o || n) continue;
                        n = !0
                    }
                    f = t > 0 ? b.floor(x * (b.abs(l - r) / t)) + 1 : 1, l < r || l === r && 0 === y ? (e = i, i += f) : (e = y - f, y -= f), g = this.calcColor(j, l, a), d && (g = this.calcHighlightColor(g, q)), s.push(v.drawRect(w, e, this.barWidth - 1, f - 1, g, g))
                }
                return 1 === s.length ? s[0] : s
            }
        }), c.fn.sparkline.tristate = w = e(c.fn.sparkline._base, t, {
            type: "tristate",
            init: function(a, b, d, e, f) {
                var g = parseInt(d.get("barWidth"), 10),
                    h = parseInt(d.get("barSpacing"), 10);
                w._super.init.call(this, a, b, d, e, f), this.regionShapes = {}, this.barWidth = g, this.barSpacing = h, this.totalBarWidth = g + h, this.values = c.map(b, Number), this.width = e = b.length * g + (b.length - 1) * h, c.isArray(d.get("colorMap")) ? (this.colorMapByIndex = d.get("colorMap"), this.colorMapByValue = null) : (this.colorMapByIndex = null, this.colorMapByValue = d.get("colorMap"), this.colorMapByValue && void 0 === this.colorMapByValue.get && (this.colorMapByValue = new q(this.colorMapByValue))), this.initTarget()
            },
            getRegion: function(a, c, d) {
                return b.floor(c / this.totalBarWidth)
            },
            getCurrentRegionFields: function() {
                var a = this.currentRegion;
                return {
                    isNull: void 0 === this.values[a],
                    value: this.values[a],
                    color: this.calcColor(this.values[a], a),
                    offset: a
                }
            },
            calcColor: function(a, b) {
                var c, d = this.values,
                    e = this.options,
                    f = this.colorMapByIndex,
                    g = this.colorMapByValue;
                return g && (c = g.get(a)) ? c : f && f.length > b ? f[b] : d[b] < 0 ? e.get("negBarColor") : d[b] > 0 ? e.get("posBarColor") : e.get("zeroBarColor")
            },
            renderRegion: function(a, c) {
                var d, e, f, g, h, i, j = this.values,
                    k = this.options,
                    l = this.target;
                if (d = l.pixelHeight, f = b.round(d / 2), g = a * this.totalBarWidth, j[a] < 0 ? (h = f, e = f - 1) : j[a] > 0 ? (h = 0, e = f - 1) : (h = f - 1, e = 2), null !== (i = this.calcColor(j[a], a))) return c && (i = this.calcHighlightColor(i, k)), l.drawRect(g, h, this.barWidth - 1, e - 1, i, i)
            }
        }), c.fn.sparkline.discrete = x = e(c.fn.sparkline._base, t, {
            type: "discrete",
            init: function(a, d, e, f, g) {
                x._super.init.call(this, a, d, e, f, g), this.regionShapes = {}, this.values = d = c.map(d, Number), this.min = b.min.apply(b, d), this.max = b.max.apply(b, d), this.range = this.max - this.min, this.width = f = "auto" === e.get("width") ? 2 * d.length : this.width, this.interval = b.floor(f / d.length), this.itemWidth = f / d.length, void 0 !== e.get("chartRangeMin") && (e.get("chartRangeClip") || e.get("chartRangeMin") < this.min) && (this.min = e.get("chartRangeMin")), void 0 !== e.get("chartRangeMax") && (e.get("chartRangeClip") || e.get("chartRangeMax") > this.max) && (this.max = e.get("chartRangeMax")), this.initTarget(), this.target && (this.lineHeight = "auto" === e.get("lineHeight") ? b.round(.3 * this.canvasHeight) : e.get("lineHeight"))
            },
            getRegion: function(a, c, d) {
                return b.floor(c / this.itemWidth)
            },
            getCurrentRegionFields: function() {
                var a = this.currentRegion;
                return {
                    isNull: void 0 === this.values[a],
                    value: this.values[a],
                    offset: a
                }
            },
            renderRegion: function(a, c) {
                var d, e, f, h, i = this.values,
                    j = this.options,
                    k = this.min,
                    l = this.max,
                    m = this.range,
                    n = this.interval,
                    o = this.target,
                    p = this.canvasHeight,
                    q = this.lineHeight,
                    r = p - q;
                return e = g(i[a], k, l), h = a * n, d = b.round(r - r * ((e - k) / m)), f = j.get("thresholdColor") && e < j.get("thresholdValue") ? j.get("thresholdColor") : j.get("lineColor"), c && (f = this.calcHighlightColor(f, j)), o.drawLine(h, d, h, d + q, f)
            }
        }), c.fn.sparkline.bullet = y = e(c.fn.sparkline._base, {
            type: "bullet",
            init: function(a, c, d, e, f) {
                var g, h, i;
                y._super.init.call(this, a, c, d, e, f), this.values = c = j(c), i = c.slice(), i[0] = null === i[0] ? i[2] : i[0], i[1] = null === c[1] ? i[2] : i[1], g = b.min.apply(b, c), h = b.max.apply(b, c), g = void 0 === d.get("base") ? g < 0 ? g : 0 : d.get("base"), this.min = g, this.max = h, this.range = h - g, this.shapes = {}, this.valueShapes = {}, this.regiondata = {}, this.width = e = "auto" === d.get("width") ? "4.0em" : e, this.target = this.$el.simpledraw(e, f, d.get("composite")), c.length || (this.disabled = !0), this.initTarget()
            },
            getRegion: function(a, b, c) {
                var d = this.target.getShapeAt(a, b, c);
                return void 0 !== d && void 0 !== this.shapes[d] ? this.shapes[d] : void 0
            },
            getCurrentRegionFields: function() {
                var a = this.currentRegion;
                return {
                    fieldkey: a.substr(0, 1),
                    value: this.values[a.substr(1)],
                    region: a
                }
            },
            changeHighlight: function(a) {
                var b, c = this.currentRegion,
                    d = this.valueShapes[c];
                switch (delete this.shapes[d], c.substr(0, 1)) {
                    case "r":
                        b = this.renderRange(c.substr(1), a);
                        break;
                    case "p":
                        b = this.renderPerformance(a);
                        break;
                    case "t":
                        b = this.renderTarget(a)
                }
                this.valueShapes[c] = b.id, this.shapes[b.id] = c, this.target.replaceWithShape(d, b)
            },
            renderRange: function(a, c) {
                var d = this.values[a],
                    e = b.round(this.canvasWidth * ((d - this.min) / this.range)),
                    f = this.options.get("rangeColors")[a - 2];
                return c && (f = this.calcHighlightColor(f, this.options)), this.target.drawRect(0, 0, e - 1, this.canvasHeight - 1, f, f)
            },
            renderPerformance: function(a) {
                var c = this.values[1],
                    d = b.round(this.canvasWidth * ((c - this.min) / this.range)),
                    e = this.options.get("performanceColor");
                return a && (e = this.calcHighlightColor(e, this.options)), this.target.drawRect(0, b.round(.3 * this.canvasHeight), d - 1, b.round(.4 * this.canvasHeight) - 1, e, e)
            },
            renderTarget: function(a) {
                var c = this.values[0],
                    d = b.round(this.canvasWidth * ((c - this.min) / this.range) - this.options.get("targetWidth") / 2),
                    e = b.round(.1 * this.canvasHeight),
                    f = this.canvasHeight - 2 * e,
                    g = this.options.get("targetColor");
                return a && (g = this.calcHighlightColor(g, this.options)), this.target.drawRect(d, e, this.options.get("targetWidth") - 1, f - 1, g, g)
            },
            render: function() {
                var a, b, c = this.values.length,
                    d = this.target;
                if (y._super.render.call(this)) {
                    for (a = 2; a < c; a++) b = this.renderRange(a).append(), this.shapes[b.id] = "r" + a, this.valueShapes["r" + a] = b.id;
                    null !== this.values[1] && (b = this.renderPerformance().append(), this.shapes[b.id] = "p1", this.valueShapes.p1 = b.id), null !== this.values[0] && (b = this.renderTarget().append(), this.shapes[b.id] = "t0", this.valueShapes.t0 = b.id), d.render()
                }
            }
        }), c.fn.sparkline.pie = z = e(c.fn.sparkline._base, {
            type: "pie",
            init: function(a, d, e, f, g) {
                var h, i = 0;
                if (z._super.init.call(this, a, d, e, f, g), this.shapes = {}, this.valueShapes = {}, this.values = d = c.map(d, Number), "auto" === e.get("width") && (this.width = this.height), d.length > 0)
                    for (h = d.length; h--;) i += d[h];
                this.total = i, this.initTarget(), this.radius = b.floor(b.min(this.canvasWidth, this.canvasHeight) / 2)
            },
            getRegion: function(a, b, c) {
                var d = this.target.getShapeAt(a, b, c);
                return void 0 !== d && void 0 !== this.shapes[d] ? this.shapes[d] : void 0
            },
            getCurrentRegionFields: function() {
                var a = this.currentRegion;
                return {
                    isNull: void 0 === this.values[a],
                    value: this.values[a],
                    percent: this.values[a] / this.total * 100,
                    color: this.options.get("sliceColors")[a % this.options.get("sliceColors").length],
                    offset: a
                }
            },
            changeHighlight: function(a) {
                var b = this.currentRegion,
                    c = this.renderSlice(b, a),
                    d = this.valueShapes[b];
                delete this.shapes[d], this.target.replaceWithShape(d, c), this.valueShapes[b] = c.id, this.shapes[c.id] = b
            },
            renderSlice: function(a, c) {
                var d, e, f, g, h, i = this.target,
                    j = this.options,
                    k = this.radius,
                    l = j.get("borderWidth"),
                    m = j.get("offset"),
                    n = 2 * b.PI,
                    o = this.values,
                    p = this.total,
                    q = m ? 2 * b.PI * (m / 360) : 0;
                for (g = o.length, f = 0; f < g; f++) {
                    if (d = q, e = q, p > 0 && (e = q + n * (o[f] / p)), a === f) return h = j.get("sliceColors")[f % j.get("sliceColors").length], c && (h = this.calcHighlightColor(h, j)), i.drawPieSlice(k, k, k - l, d, e, void 0, h);
                    q = e
                }
            },
            render: function() {
                var a, c, d = this.target,
                    e = this.values,
                    f = this.options,
                    g = this.radius,
                    h = f.get("borderWidth");
                if (z._super.render.call(this)) {
                    for (h && d.drawCircle(g, g, b.floor(g - h / 2), f.get("borderColor"), void 0, h).append(), c = e.length; c--;) e[c] && (a = this.renderSlice(c).append(), this.valueShapes[c] = a.id, this.shapes[a.id] = c);
                    d.render()
                }
            }
        }), c.fn.sparkline.box = A = e(c.fn.sparkline._base, {
            type: "box",
            init: function(a, b, d, e, f) {
                A._super.init.call(this, a, b, d, e, f), this.values = c.map(b, Number), this.width = "auto" === d.get("width") ? "4.0em" : e, this.initTarget(), this.values.length || (this.disabled = 1)
            },
            getRegion: function() {
                return 1
            },
            getCurrentRegionFields: function() {
                var a = [{
                    field: "lq",
                    value: this.quartiles[0]
                }, {
                    field: "med",
                    value: this.quartiles[1]
                }, {
                    field: "uq",
                    value: this.quartiles[2]
                }];
                return void 0 !== this.loutlier && a.push({
                    field: "lo",
                    value: this.loutlier
                }), void 0 !== this.routlier && a.push({
                    field: "ro",
                    value: this.routlier
                }), void 0 !== this.lwhisker && a.push({
                    field: "lw",
                    value: this.lwhisker
                }), void 0 !== this.rwhisker && a.push({
                    field: "rw",
                    value: this.rwhisker
                }), a
            },
            render: function() {
                var a, c, d, e, f, g, i, j, k, l, m, n = this.target,
                    o = this.values,
                    p = o.length,
                    q = this.options,
                    r = this.canvasWidth,
                    s = this.canvasHeight,
                    t = void 0 === q.get("chartRangeMin") ? b.min.apply(b, o) : q.get("chartRangeMin"),
                    u = void 0 === q.get("chartRangeMax") ? b.max.apply(b, o) : q.get("chartRangeMax"),
                    v = 0;
                if (A._super.render.call(this)) {
                    if (q.get("raw")) q.get("showOutliers") && o.length > 5 ? (c = o[0], a = o[1], e = o[2], f = o[3], g = o[4], i = o[5], j = o[6]) : (a = o[0], e = o[1], f = o[2], g = o[3], i = o[4]);
                    else if (o.sort(function(a, b) {
                            return a - b
                        }), e = h(o, 1), f = h(o, 2), g = h(o, 3), d = g - e, q.get("showOutliers")) {
                        for (a = i = void 0, k = 0; k < p; k++) void 0 === a && o[k] > e - d * q.get("outlierIQR") && (a = o[k]), o[k] < g + d * q.get("outlierIQR") && (i = o[k]);
                        c = o[0], j = o[p - 1]
                    } else a = o[0], i = o[p - 1];
                    this.quartiles = [e, f, g], this.lwhisker = a, this.rwhisker = i, this.loutlier = c, this.routlier = j, m = r / (u - t + 1), q.get("showOutliers") && (v = b.ceil(q.get("spotRadius")), r -= 2 * b.ceil(q.get("spotRadius")), m = r / (u - t + 1), c < a && n.drawCircle((c - t) * m + v, s / 2, q.get("spotRadius"), q.get("outlierLineColor"), q.get("outlierFillColor")).append(), j > i && n.drawCircle((j - t) * m + v, s / 2, q.get("spotRadius"), q.get("outlierLineColor"), q.get("outlierFillColor")).append()), n.drawRect(b.round((e - t) * m + v), b.round(.1 * s), b.round((g - e) * m), b.round(.8 * s), q.get("boxLineColor"), q.get("boxFillColor")).append(), n.drawLine(b.round((a - t) * m + v), b.round(s / 2), b.round((e - t) * m + v), b.round(s / 2), q.get("lineColor")).append(), n.drawLine(b.round((a - t) * m + v), b.round(s / 4), b.round((a - t) * m + v), b.round(s - s / 4), q.get("whiskerColor")).append(), n.drawLine(b.round((i - t) * m + v), b.round(s / 2), b.round((g - t) * m + v), b.round(s / 2), q.get("lineColor")).append(), n.drawLine(b.round((i - t) * m + v), b.round(s / 4), b.round((i - t) * m + v), b.round(s - s / 4), q.get("whiskerColor")).append(), n.drawLine(b.round((f - t) * m + v), b.round(.1 * s), b.round((f - t) * m + v), b.round(.9 * s), q.get("medianColor")).append(), q.get("target") && (l = b.ceil(q.get("spotRadius")), n.drawLine(b.round((q.get("target") - t) * m + v), b.round(s / 2 - l), b.round((q.get("target") - t) * m + v), b.round(s / 2 + l), q.get("targetColor")).append(), n.drawLine(b.round((q.get("target") - t) * m + v - l), b.round(s / 2), b.round((q.get("target") - t) * m + v + l), b.round(s / 2), q.get("targetColor")).append()), n.render()
                }
            }
        }), D = e({
            init: function(a, b, c, d) {
                this.target = a, this.id = b, this.type = c, this.args = d
            },
            append: function() {
                return this.target.appendShape(this), this
            }
        }), E = e({
            _pxregex: /(\d+)(px)?\s*$/i,
            init: function(a, b, d) {
                a && (this.width = a, this.height = b, this.target = d, this.lastShapeId = null, d[0] && (d = d[0]), c.data(d, "_jqs_vcanvas", this))
            },
            drawLine: function(a, b, c, d, e, f) {
                return this.drawShape([
                    [a, b],
                    [c, d]
                ], e, f)
            },
            drawShape: function(a, b, c, d) {
                return this._genShape("Shape", [a, b, c, d])
            },
            drawCircle: function(a, b, c, d, e, f) {
                return this._genShape("Circle", [a, b, c, d, e, f])
            },
            drawPieSlice: function(a, b, c, d, e, f, g) {
                return this._genShape("PieSlice", [a, b, c, d, e, f, g])
            },
            drawRect: function(a, b, c, d, e, f) {
                return this._genShape("Rect", [a, b, c, d, e, f])
            },
            getElement: function() {
                return this.canvas
            },
            getLastShapeId: function() {
                return this.lastShapeId
            },
            reset: function() {
                alert("reset not implemented")
            },
            _insert: function(a, b) {
                c(b).html(a)
            },
            _calculatePixelDims: function(a, b, d) {
                var e;
                e = this._pxregex.exec(b), this.pixelHeight = e ? e[1] : c(d).height(), e = this._pxregex.exec(a), this.pixelWidth = e ? e[1] : c(d).width()
            },
            _genShape: function(a, b) {
                var c = J++;
                return b.unshift(c), new D(this, c, a, b)
            },
            appendShape: function(a) {
                alert("appendShape not implemented")
            },
            replaceWithShape: function(a, b) {
                alert("replaceWithShape not implemented")
            },
            insertAfterShape: function(a, b) {
                alert("insertAfterShape not implemented")
            },
            removeShapeId: function(a) {
                alert("removeShapeId not implemented")
            },
            getShapeAt: function(a, b, c) {
                alert("getShapeAt not implemented")
            },
            render: function() {
                alert("render not implemented")
            }
        }), F = e(E, {
            init: function(b, d, e, f) {
                F._super.init.call(this, b, d, e), this.canvas = a.createElement("canvas"), e[0] && (e = e[0]), c.data(e, "_jqs_vcanvas", this), c(this.canvas).css({
                    display: "inline-block",
                    width: b,
                    height: d,
                    verticalAlign: "top"
                }), this._insert(this.canvas, e), this._calculatePixelDims(b, d, this.canvas), this.canvas.width = this.pixelWidth, this.canvas.height = this.pixelHeight, this.interact = f, this.shapes = {}, this.shapeseq = [], this.currentTargetShapeId = void 0, c(this.canvas).css({
                    width: this.pixelWidth,
                    height: this.pixelHeight
                })
            },
            _getContext: function(a, b, c) {
                var d = this.canvas.getContext("2d");
                return void 0 !== a && (d.strokeStyle = a), d.lineWidth = void 0 === c ? 1 : c, void 0 !== b && (d.fillStyle = b), d
            },
            reset: function() {
                this._getContext().clearRect(0, 0, this.pixelWidth, this.pixelHeight), this.shapes = {}, this.shapeseq = [], this.currentTargetShapeId = void 0
            },
            _drawShape: function(a, b, c, d, e) {
                var f, g, h = this._getContext(c, d, e);
                for (h.beginPath(), h.moveTo(b[0][0] + .5, b[0][1] + .5), f = 1, g = b.length; f < g; f++) h.lineTo(b[f][0] + .5, b[f][1] + .5);
                void 0 !== c && h.stroke(), void 0 !== d && h.fill(), void 0 !== this.targetX && void 0 !== this.targetY && h.isPointInPath(this.targetX, this.targetY) && (this.currentTargetShapeId = a)
            },
            _drawCircle: function(a, c, d, e, f, g, h) {
                var i = this._getContext(f, g, h);
                i.beginPath(), i.arc(c, d, e, 0, 2 * b.PI, !1), void 0 !== this.targetX && void 0 !== this.targetY && i.isPointInPath(this.targetX, this.targetY) && (this.currentTargetShapeId = a), void 0 !== f && i.stroke(), void 0 !== g && i.fill()
            },
            _drawPieSlice: function(a, b, c, d, e, f, g, h) {
                var i = this._getContext(g, h);
                i.beginPath(), i.moveTo(b, c), i.arc(b, c, d, e, f, !1), i.lineTo(b, c), i.closePath(), void 0 !== g && i.stroke(), h && i.fill(), void 0 !== this.targetX && void 0 !== this.targetY && i.isPointInPath(this.targetX, this.targetY) && (this.currentTargetShapeId = a)
            },
            _drawRect: function(a, b, c, d, e, f, g) {
                return this._drawShape(a, [
                    [b, c],
                    [b + d, c],
                    [b + d, c + e],
                    [b, c + e],
                    [b, c]
                ], f, g)
            },
            appendShape: function(a) {
                return this.shapes[a.id] = a, this.shapeseq.push(a.id), this.lastShapeId = a.id, a.id
            },
            replaceWithShape: function(a, b) {
                var c, d = this.shapeseq;
                for (this.shapes[b.id] = b, c = d.length; c--;) d[c] == a && (d[c] = b.id);
                delete this.shapes[a]
            },
            replaceWithShapes: function(a, b) {
                var c, d, e, f = this.shapeseq,
                    g = {};
                for (d = a.length; d--;) g[a[d]] = !0;
                for (d = f.length; d--;) c = f[d], g[c] && (f.splice(d, 1), delete this.shapes[c], e = d);
                for (d = b.length; d--;) f.splice(e, 0, b[d].id), this.shapes[b[d].id] = b[d]
            },
            insertAfterShape: function(a, b) {
                var c, d = this.shapeseq;
                for (c = d.length; c--;)
                    if (d[c] === a) return d.splice(c + 1, 0, b.id), void(this.shapes[b.id] = b)
            },
            removeShapeId: function(a) {
                var b, c = this.shapeseq;
                for (b = c.length; b--;)
                    if (c[b] === a) {
                        c.splice(b, 1);
                        break
                    }
                delete this.shapes[a]
            },
            getShapeAt: function(a, b, c) {
                return this.targetX = b, this.targetY = c, this.render(), this.currentTargetShapeId
            },
            render: function() {
                var a, b, c, d = this.shapeseq,
                    e = this.shapes,
                    f = d.length,
                    g = this._getContext();
                for (g.clearRect(0, 0, this.pixelWidth, this.pixelHeight), c = 0; c < f; c++) a = d[c], b = e[a], this["_draw" + b.type].apply(this, b.args);
                this.interact || (this.shapes = {}, this.shapeseq = [])
            }
        }), G = e(E, {
            init: function(b, d, e) {
                var f;
                G._super.init.call(this, b, d, e), e[0] && (e = e[0]), c.data(e, "_jqs_vcanvas", this), this.canvas = a.createElement("span"), c(this.canvas).css({
                    display: "inline-block",
                    position: "relative",
                    overflow: "hidden",
                    width: b,
                    height: d,
                    margin: "0px",
                    padding: "0px",
                    verticalAlign: "top"
                }), this._insert(this.canvas, e), this._calculatePixelDims(b, d, this.canvas), this.canvas.width = this.pixelWidth, this.canvas.height = this.pixelHeight, f = '<v:group coordorigin="0 0" coordsize="' + this.pixelWidth + " " + this.pixelHeight + '" style="position:absolute;top:0;left:0;width:' + this.pixelWidth + "px;height=" + this.pixelHeight + 'px;"></v:group>', this.canvas.insertAdjacentHTML("beforeEnd", f), this.group = c(this.canvas).children()[0], this.rendered = !1, this.prerender = ""
            },
            _drawShape: function(a, b, c, d, e) {
                var f, g, h, i, j, k, l = [];
                for (k = 0, j = b.length; k < j; k++) l[k] = b[k][0] + "," + b[k][1];
                return f = l.splice(0, 1), e = void 0 === e ? 1 : e, g = void 0 === c ? ' stroked="false" ' : ' strokeWeight="' + e + 'px" strokeColor="' + c + '" ', h = void 0 === d ? ' filled="false"' : ' fillColor="' + d + '" filled="true" ', i = l[0] === l[l.length - 1] ? "x " : "", '<v:shape coordorigin="0 0" coordsize="' + this.pixelWidth + " " + this.pixelHeight + '"  id="jqsshape' + a + '" ' + g + h + ' style="position:absolute;left:0px;top:0px;height:' + this.pixelHeight + "px;width:" + this.pixelWidth + 'px;padding:0px;margin:0px;"  path="m ' + f + " l " + l.join(", ") + " " + i + 'e"> </v:shape>'
            },
            _drawCircle: function(a, b, c, d, e, f, g) {
                var h, i;
                return b -= d, c -= d, h = void 0 === e ? ' stroked="false" ' : ' strokeWeight="' + g + 'px" strokeColor="' + e + '" ', i = void 0 === f ? ' filled="false"' : ' fillColor="' + f + '" filled="true" ', '<v:oval  id="jqsshape' + a + '" ' + h + i + ' style="position:absolute;top:' + c + "px; left:" + b + "px; width:" + 2 * d + "px; height:" + 2 * d + 'px"></v:oval>'
            },
            _drawPieSlice: function(a, c, d, e, f, g, h, i) {
                var j, k, l, m, n, o, p;
                if (f === g) return "";
                if (g - f == 2 * b.PI && (f = 0, g = 2 * b.PI), k = c + b.round(b.cos(f) * e), l = d + b.round(b.sin(f) * e), m = c + b.round(b.cos(g) * e), n = d + b.round(b.sin(g) * e), k === m && l === n) {
                    if (g - f < b.PI) return "";
                    k = m = c + e, l = n = d
                }
                return k === m && l === n && g - f < b.PI ? "" : (j = [c - e, d - e, c + e, d + e, k, l, m, n], o = void 0 === h ? ' stroked="false" ' : ' strokeWeight="1px" strokeColor="' + h + '" ', p = void 0 === i ? ' filled="false"' : ' fillColor="' + i + '" filled="true" ', '<v:shape coordorigin="0 0" coordsize="' + this.pixelWidth + " " + this.pixelHeight + '"  id="jqsshape' + a + '" ' + o + p + ' style="position:absolute;left:0px;top:0px;height:' + this.pixelHeight + "px;width:" + this.pixelWidth + 'px;padding:0px;margin:0px;"  path="m ' + c + "," + d + " wa " + j.join(", ") + ' x e"> </v:shape>')
            },
            _drawRect: function(a, b, c, d, e, f, g) {
                return this._drawShape(a, [
                    [b, c],
                    [b, c + e],
                    [b + d, c + e],
                    [b + d, c],
                    [b, c]
                ], f, g)
            },
            reset: function() {
                this.group.innerHTML = ""
            },
            appendShape: function(a) {
                var b = this["_draw" + a.type].apply(this, a.args);
                return this.rendered ? this.group.insertAdjacentHTML("beforeEnd", b) : this.prerender += b, this.lastShapeId = a.id, a.id
            },
            replaceWithShape: function(a, b) {
                var d = c("#jqsshape" + a),
                    e = this["_draw" + b.type].apply(this, b.args);
                d[0].outerHTML = e
            },
            replaceWithShapes: function(a, b) {
                var d, e = c("#jqsshape" + a[0]),
                    f = "",
                    g = b.length;
                for (d = 0; d < g; d++) f += this["_draw" + b[d].type].apply(this, b[d].args);
                for (e[0].outerHTML = f, d = 1; d < a.length; d++) c("#jqsshape" + a[d]).remove()
            },
            insertAfterShape: function(a, b) {
                var d = c("#jqsshape" + a),
                    e = this["_draw" + b.type].apply(this, b.args);
                d[0].insertAdjacentHTML("afterEnd", e)
            },
            removeShapeId: function(a) {
                var b = c("#jqsshape" + a);
                this.group.removeChild(b[0])
            },
            getShapeAt: function(a, b, c) {
                return a.id.substr(8)
            },
            render: function() {
                this.rendered || (this.group.innerHTML = this.prerender, this.rendered = !0)
            }
        })
    })
}(document, Math),
function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery)
}(function(a) {
    function b(a, b) {
        return a.toFixed(b.decimals)
    }
    var c = function(b, d) {
        this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, this.dataOptions(), d), this.init()
    };
    c.DEFAULTS = {
        from: 0,
        to: 0,
        speed: 1e3,
        refreshInterval: 100,
        decimals: 0,
        formatter: b,
        onUpdate: null,
        onComplete: null
    }, c.prototype.init = function() {
        this.value = this.options.from, this.loops = Math.ceil(this.options.speed / this.options.refreshInterval), this.loopCount = 0, this.increment = (this.options.to - this.options.from) / this.loops
    }, c.prototype.dataOptions = function() {
        var a = {
                from: this.$element.data("from"),
                to: this.$element.data("to"),
                speed: this.$element.data("speed"),
                refreshInterval: this.$element.data("refresh-interval"),
                decimals: this.$element.data("decimals")
            },
            b = Object.keys(a);
        for (var c in b) {
            var d = b[c];
            void 0 === a[d] && delete a[d]
        }
        return a
    }, c.prototype.update = function() {
        this.value += this.increment, this.loopCount++, this.render(), "function" == typeof this.options.onUpdate && this.options.onUpdate.call(this.$element, this.value), this.loopCount >= this.loops && (clearInterval(this.interval), this.value = this.options.to, "function" == typeof this.options.onComplete && this.options.onComplete.call(this.$element, this.value))
    }, c.prototype.render = function() {
        var a = this.options.formatter.call(this.$element, this.value, this.options);
        this.$element.text(a)
    }, c.prototype.restart = function() {
        this.stop(), this.init(), this.start()
    }, c.prototype.start = function() {
        this.stop(), this.render(), this.interval = setInterval(this.update.bind(this), this.options.refreshInterval)
    }, c.prototype.stop = function() {
        this.interval && clearInterval(this.interval)
    }, c.prototype.toggle = function() {
        this.interval ? this.stop() : this.start()
    }, a.fn.countTo = function(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("countTo"),
                f = !e || "object" == typeof b,
                g = "object" == typeof b ? b : {},
                h = "string" == typeof b ? b : "start";
            f && (e && e.stop(), d.data("countTo", e = new c(this, g))), e[h].call(e)
        })
    }
});