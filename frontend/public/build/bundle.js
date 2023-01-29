
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty$1() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self$1(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const PACKET_TYPES = Object.create(null); // no Map = no polyfill
    PACKET_TYPES["open"] = "0";
    PACKET_TYPES["close"] = "1";
    PACKET_TYPES["ping"] = "2";
    PACKET_TYPES["pong"] = "3";
    PACKET_TYPES["message"] = "4";
    PACKET_TYPES["upgrade"] = "5";
    PACKET_TYPES["noop"] = "6";
    const PACKET_TYPES_REVERSE = Object.create(null);
    Object.keys(PACKET_TYPES).forEach(key => {
        PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
    });
    const ERROR_PACKET = { type: "error", data: "parser error" };

    const withNativeBlob$1 = typeof Blob === "function" ||
        (typeof Blob !== "undefined" &&
            Object.prototype.toString.call(Blob) === "[object BlobConstructor]");
    const withNativeArrayBuffer$2 = typeof ArrayBuffer === "function";
    // ArrayBuffer.isView method is not defined in IE10
    const isView$1 = obj => {
        return typeof ArrayBuffer.isView === "function"
            ? ArrayBuffer.isView(obj)
            : obj && obj.buffer instanceof ArrayBuffer;
    };
    const encodePacket = ({ type, data }, supportsBinary, callback) => {
        if (withNativeBlob$1 && data instanceof Blob) {
            if (supportsBinary) {
                return callback(data);
            }
            else {
                return encodeBlobAsBase64(data, callback);
            }
        }
        else if (withNativeArrayBuffer$2 &&
            (data instanceof ArrayBuffer || isView$1(data))) {
            if (supportsBinary) {
                return callback(data);
            }
            else {
                return encodeBlobAsBase64(new Blob([data]), callback);
            }
        }
        // plain string
        return callback(PACKET_TYPES[type] + (data || ""));
    };
    const encodeBlobAsBase64 = (data, callback) => {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const content = fileReader.result.split(",")[1];
            callback("b" + (content || ""));
        };
        return fileReader.readAsDataURL(data);
    };

    // imported from https://github.com/socketio/base64-arraybuffer
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    // Use a lookup table to find the index.
    const lookup$1 = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
        lookup$1[chars.charCodeAt(i)] = i;
    }
    const decode$1 = (base64) => {
        let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') {
                bufferLength--;
            }
        }
        const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
            encoded1 = lookup$1[base64.charCodeAt(i)];
            encoded2 = lookup$1[base64.charCodeAt(i + 1)];
            encoded3 = lookup$1[base64.charCodeAt(i + 2)];
            encoded4 = lookup$1[base64.charCodeAt(i + 3)];
            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
        return arraybuffer;
    };

    const withNativeArrayBuffer$1 = typeof ArrayBuffer === "function";
    const decodePacket = (encodedPacket, binaryType) => {
        if (typeof encodedPacket !== "string") {
            return {
                type: "message",
                data: mapBinary(encodedPacket, binaryType)
            };
        }
        const type = encodedPacket.charAt(0);
        if (type === "b") {
            return {
                type: "message",
                data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
            };
        }
        const packetType = PACKET_TYPES_REVERSE[type];
        if (!packetType) {
            return ERROR_PACKET;
        }
        return encodedPacket.length > 1
            ? {
                type: PACKET_TYPES_REVERSE[type],
                data: encodedPacket.substring(1)
            }
            : {
                type: PACKET_TYPES_REVERSE[type]
            };
    };
    const decodeBase64Packet = (data, binaryType) => {
        if (withNativeArrayBuffer$1) {
            const decoded = decode$1(data);
            return mapBinary(decoded, binaryType);
        }
        else {
            return { base64: true, data }; // fallback for old browsers
        }
    };
    const mapBinary = (data, binaryType) => {
        switch (binaryType) {
            case "blob":
                return data instanceof ArrayBuffer ? new Blob([data]) : data;
            case "arraybuffer":
            default:
                return data; // assuming the data is already an ArrayBuffer
        }
    };

    const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
    const encodePayload = (packets, callback) => {
        // some packets may be added to the array while encoding, so the initial length must be saved
        const length = packets.length;
        const encodedPackets = new Array(length);
        let count = 0;
        packets.forEach((packet, i) => {
            // force base64 encoding for binary packets
            encodePacket(packet, false, encodedPacket => {
                encodedPackets[i] = encodedPacket;
                if (++count === length) {
                    callback(encodedPackets.join(SEPARATOR));
                }
            });
        });
    };
    const decodePayload = (encodedPayload, binaryType) => {
        const encodedPackets = encodedPayload.split(SEPARATOR);
        const packets = [];
        for (let i = 0; i < encodedPackets.length; i++) {
            const decodedPacket = decodePacket(encodedPackets[i], binaryType);
            packets.push(decodedPacket);
            if (decodedPacket.type === "error") {
                break;
            }
        }
        return packets;
    };
    const protocol$1 = 4;

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    }

    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      // Remove event specific arrays for event types that no
      // one is subscribed for to avoid memory leak.
      if (callbacks.length === 0) {
        delete this._callbacks['$' + event];
      }

      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};

      var args = new Array(arguments.length - 1)
        , callbacks = this._callbacks['$' + event];

      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    // alias used for reserved events (protected method)
    Emitter.prototype.emitReserved = Emitter.prototype.emit;

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };

    const globalThisShim = (() => {
        if (typeof self !== "undefined") {
            return self;
        }
        else if (typeof window !== "undefined") {
            return window;
        }
        else {
            return Function("return this")();
        }
    })();

    function pick(obj, ...attr) {
        return attr.reduce((acc, k) => {
            if (obj.hasOwnProperty(k)) {
                acc[k] = obj[k];
            }
            return acc;
        }, {});
    }
    // Keep a reference to the real timeout functions so they can be used when overridden
    const NATIVE_SET_TIMEOUT = setTimeout;
    const NATIVE_CLEAR_TIMEOUT = clearTimeout;
    function installTimerFunctions(obj, opts) {
        if (opts.useNativeTimers) {
            obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
            obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
        }
        else {
            obj.setTimeoutFn = setTimeout.bind(globalThisShim);
            obj.clearTimeoutFn = clearTimeout.bind(globalThisShim);
        }
    }
    // base64 encoded buffers are about 33% bigger (https://en.wikipedia.org/wiki/Base64)
    const BASE64_OVERHEAD = 1.33;
    // we could also have used `new Blob([obj]).size`, but it isn't supported in IE9
    function byteLength(obj) {
        if (typeof obj === "string") {
            return utf8Length(obj);
        }
        // arraybuffer or blob
        return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
    }
    function utf8Length(str) {
        let c = 0, length = 0;
        for (let i = 0, l = str.length; i < l; i++) {
            c = str.charCodeAt(i);
            if (c < 0x80) {
                length += 1;
            }
            else if (c < 0x800) {
                length += 2;
            }
            else if (c < 0xd800 || c >= 0xe000) {
                length += 3;
            }
            else {
                i++;
                length += 4;
            }
        }
        return length;
    }

    class TransportError extends Error {
        constructor(reason, description, context) {
            super(reason);
            this.description = description;
            this.context = context;
            this.type = "TransportError";
        }
    }
    class Transport extends Emitter {
        /**
         * Transport abstract constructor.
         *
         * @param {Object} options.
         * @api private
         */
        constructor(opts) {
            super();
            this.writable = false;
            installTimerFunctions(this, opts);
            this.opts = opts;
            this.query = opts.query;
            this.readyState = "";
            this.socket = opts.socket;
        }
        /**
         * Emits an error.
         *
         * @param {String} reason
         * @param description
         * @param context - the error context
         * @return {Transport} for chaining
         * @api protected
         */
        onError(reason, description, context) {
            super.emitReserved("error", new TransportError(reason, description, context));
            return this;
        }
        /**
         * Opens the transport.
         *
         * @api public
         */
        open() {
            if ("closed" === this.readyState || "" === this.readyState) {
                this.readyState = "opening";
                this.doOpen();
            }
            return this;
        }
        /**
         * Closes the transport.
         *
         * @api public
         */
        close() {
            if ("opening" === this.readyState || "open" === this.readyState) {
                this.doClose();
                this.onClose();
            }
            return this;
        }
        /**
         * Sends multiple packets.
         *
         * @param {Array} packets
         * @api public
         */
        send(packets) {
            if ("open" === this.readyState) {
                this.write(packets);
            }
        }
        /**
         * Called upon open
         *
         * @api protected
         */
        onOpen() {
            this.readyState = "open";
            this.writable = true;
            super.emitReserved("open");
        }
        /**
         * Called with data.
         *
         * @param {String} data
         * @api protected
         */
        onData(data) {
            const packet = decodePacket(data, this.socket.binaryType);
            this.onPacket(packet);
        }
        /**
         * Called with a decoded packet.
         *
         * @api protected
         */
        onPacket(packet) {
            super.emitReserved("packet", packet);
        }
        /**
         * Called upon close.
         *
         * @api protected
         */
        onClose(details) {
            this.readyState = "closed";
            super.emitReserved("close", details);
        }
    }

    // imported from https://github.com/unshiftio/yeast
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''), length = 64, map = {};
    let seed = 0, i = 0, prev;
    /**
     * Return a string representing the specified number.
     *
     * @param {Number} num The number to convert.
     * @returns {String} The string representation of the number.
     * @api public
     */
    function encode$1(num) {
        let encoded = '';
        do {
            encoded = alphabet[num % length] + encoded;
            num = Math.floor(num / length);
        } while (num > 0);
        return encoded;
    }
    /**
     * Yeast: A tiny growing id generator.
     *
     * @returns {String} A unique id.
     * @api public
     */
    function yeast() {
        const now = encode$1(+new Date());
        if (now !== prev)
            return seed = 0, prev = now;
        return now + '.' + encode$1(seed++);
    }
    //
    // Map each character to its index.
    //
    for (; i < length; i++)
        map[alphabet[i]] = i;

    // imported from https://github.com/galkn/querystring
    /**
     * Compiles a querystring
     * Returns string representation of the object
     *
     * @param {Object}
     * @api private
     */
    function encode(obj) {
        let str = '';
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (str.length)
                    str += '&';
                str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
            }
        }
        return str;
    }
    /**
     * Parses a simple querystring into an object
     *
     * @param {String} qs
     * @api private
     */
    function decode(qs) {
        let qry = {};
        let pairs = qs.split('&');
        for (let i = 0, l = pairs.length; i < l; i++) {
            let pair = pairs[i].split('=');
            qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return qry;
    }

    // imported from https://github.com/component/has-cors
    let value = false;
    try {
        value = typeof XMLHttpRequest !== 'undefined' &&
            'withCredentials' in new XMLHttpRequest();
    }
    catch (err) {
        // if XMLHttp support is disabled in IE then it will throw
        // when trying to create
    }
    const hasCORS = value;

    // browser shim for xmlhttprequest module
    function XHR(opts) {
        const xdomain = opts.xdomain;
        // XMLHttpRequest can be disabled on IE
        try {
            if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
                return new XMLHttpRequest();
            }
        }
        catch (e) { }
        if (!xdomain) {
            try {
                return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
            }
            catch (e) { }
        }
    }

    function empty() { }
    const hasXHR2 = (function () {
        const xhr = new XHR({
            xdomain: false
        });
        return null != xhr.responseType;
    })();
    class Polling extends Transport {
        /**
         * XHR Polling constructor.
         *
         * @param {Object} opts
         * @api public
         */
        constructor(opts) {
            super(opts);
            this.polling = false;
            if (typeof location !== "undefined") {
                const isSSL = "https:" === location.protocol;
                let port = location.port;
                // some user agents have empty `location.port`
                if (!port) {
                    port = isSSL ? "443" : "80";
                }
                this.xd =
                    (typeof location !== "undefined" &&
                        opts.hostname !== location.hostname) ||
                        port !== opts.port;
                this.xs = opts.secure !== isSSL;
            }
            /**
             * XHR supports binary
             */
            const forceBase64 = opts && opts.forceBase64;
            this.supportsBinary = hasXHR2 && !forceBase64;
        }
        /**
         * Transport name.
         */
        get name() {
            return "polling";
        }
        /**
         * Opens the socket (triggers polling). We write a PING message to determine
         * when the transport is open.
         *
         * @api private
         */
        doOpen() {
            this.poll();
        }
        /**
         * Pauses polling.
         *
         * @param {Function} callback upon buffers are flushed and transport is paused
         * @api private
         */
        pause(onPause) {
            this.readyState = "pausing";
            const pause = () => {
                this.readyState = "paused";
                onPause();
            };
            if (this.polling || !this.writable) {
                let total = 0;
                if (this.polling) {
                    total++;
                    this.once("pollComplete", function () {
                        --total || pause();
                    });
                }
                if (!this.writable) {
                    total++;
                    this.once("drain", function () {
                        --total || pause();
                    });
                }
            }
            else {
                pause();
            }
        }
        /**
         * Starts polling cycle.
         *
         * @api public
         */
        poll() {
            this.polling = true;
            this.doPoll();
            this.emitReserved("poll");
        }
        /**
         * Overloads onData to detect payloads.
         *
         * @api private
         */
        onData(data) {
            const callback = packet => {
                // if its the first message we consider the transport open
                if ("opening" === this.readyState && packet.type === "open") {
                    this.onOpen();
                }
                // if its a close packet, we close the ongoing requests
                if ("close" === packet.type) {
                    this.onClose({ description: "transport closed by the server" });
                    return false;
                }
                // otherwise bypass onData and handle the message
                this.onPacket(packet);
            };
            // decode payload
            decodePayload(data, this.socket.binaryType).forEach(callback);
            // if an event did not trigger closing
            if ("closed" !== this.readyState) {
                // if we got data we're not polling
                this.polling = false;
                this.emitReserved("pollComplete");
                if ("open" === this.readyState) {
                    this.poll();
                }
            }
        }
        /**
         * For polling, send a close packet.
         *
         * @api private
         */
        doClose() {
            const close = () => {
                this.write([{ type: "close" }]);
            };
            if ("open" === this.readyState) {
                close();
            }
            else {
                // in case we're trying to close while
                // handshaking is in progress (GH-164)
                this.once("open", close);
            }
        }
        /**
         * Writes a packets payload.
         *
         * @param {Array} data packets
         * @param {Function} drain callback
         * @api private
         */
        write(packets) {
            this.writable = false;
            encodePayload(packets, data => {
                this.doWrite(data, () => {
                    this.writable = true;
                    this.emitReserved("drain");
                });
            });
        }
        /**
         * Generates uri for connection.
         *
         * @api private
         */
        uri() {
            let query = this.query || {};
            const schema = this.opts.secure ? "https" : "http";
            let port = "";
            // cache busting is forced
            if (false !== this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast();
            }
            if (!this.supportsBinary && !query.sid) {
                query.b64 = 1;
            }
            // avoid port if default for schema
            if (this.opts.port &&
                (("https" === schema && Number(this.opts.port) !== 443) ||
                    ("http" === schema && Number(this.opts.port) !== 80))) {
                port = ":" + this.opts.port;
            }
            const encodedQuery = encode(query);
            const ipv6 = this.opts.hostname.indexOf(":") !== -1;
            return (schema +
                "://" +
                (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
                port +
                this.opts.path +
                (encodedQuery.length ? "?" + encodedQuery : ""));
        }
        /**
         * Creates a request.
         *
         * @param {String} method
         * @api private
         */
        request(opts = {}) {
            Object.assign(opts, { xd: this.xd, xs: this.xs }, this.opts);
            return new Request(this.uri(), opts);
        }
        /**
         * Sends data.
         *
         * @param {String} data to send.
         * @param {Function} called upon flush.
         * @api private
         */
        doWrite(data, fn) {
            const req = this.request({
                method: "POST",
                data: data
            });
            req.on("success", fn);
            req.on("error", (xhrStatus, context) => {
                this.onError("xhr post error", xhrStatus, context);
            });
        }
        /**
         * Starts a poll cycle.
         *
         * @api private
         */
        doPoll() {
            const req = this.request();
            req.on("data", this.onData.bind(this));
            req.on("error", (xhrStatus, context) => {
                this.onError("xhr poll error", xhrStatus, context);
            });
            this.pollXhr = req;
        }
    }
    class Request extends Emitter {
        /**
         * Request constructor
         *
         * @param {Object} options
         * @api public
         */
        constructor(uri, opts) {
            super();
            installTimerFunctions(this, opts);
            this.opts = opts;
            this.method = opts.method || "GET";
            this.uri = uri;
            this.async = false !== opts.async;
            this.data = undefined !== opts.data ? opts.data : null;
            this.create();
        }
        /**
         * Creates the XHR object and sends the request.
         *
         * @api private
         */
        create() {
            const opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
            opts.xdomain = !!this.opts.xd;
            opts.xscheme = !!this.opts.xs;
            const xhr = (this.xhr = new XHR(opts));
            try {
                xhr.open(this.method, this.uri, this.async);
                try {
                    if (this.opts.extraHeaders) {
                        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                        for (let i in this.opts.extraHeaders) {
                            if (this.opts.extraHeaders.hasOwnProperty(i)) {
                                xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
                            }
                        }
                    }
                }
                catch (e) { }
                if ("POST" === this.method) {
                    try {
                        xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                    }
                    catch (e) { }
                }
                try {
                    xhr.setRequestHeader("Accept", "*/*");
                }
                catch (e) { }
                // ie6 check
                if ("withCredentials" in xhr) {
                    xhr.withCredentials = this.opts.withCredentials;
                }
                if (this.opts.requestTimeout) {
                    xhr.timeout = this.opts.requestTimeout;
                }
                xhr.onreadystatechange = () => {
                    if (4 !== xhr.readyState)
                        return;
                    if (200 === xhr.status || 1223 === xhr.status) {
                        this.onLoad();
                    }
                    else {
                        // make sure the `error` event handler that's user-set
                        // does not throw in the same tick and gets caught here
                        this.setTimeoutFn(() => {
                            this.onError(typeof xhr.status === "number" ? xhr.status : 0);
                        }, 0);
                    }
                };
                xhr.send(this.data);
            }
            catch (e) {
                // Need to defer since .create() is called directly from the constructor
                // and thus the 'error' event can only be only bound *after* this exception
                // occurs.  Therefore, also, we cannot throw here at all.
                this.setTimeoutFn(() => {
                    this.onError(e);
                }, 0);
                return;
            }
            if (typeof document !== "undefined") {
                this.index = Request.requestsCount++;
                Request.requests[this.index] = this;
            }
        }
        /**
         * Called upon error.
         *
         * @api private
         */
        onError(err) {
            this.emitReserved("error", err, this.xhr);
            this.cleanup(true);
        }
        /**
         * Cleans up house.
         *
         * @api private
         */
        cleanup(fromError) {
            if ("undefined" === typeof this.xhr || null === this.xhr) {
                return;
            }
            this.xhr.onreadystatechange = empty;
            if (fromError) {
                try {
                    this.xhr.abort();
                }
                catch (e) { }
            }
            if (typeof document !== "undefined") {
                delete Request.requests[this.index];
            }
            this.xhr = null;
        }
        /**
         * Called upon load.
         *
         * @api private
         */
        onLoad() {
            const data = this.xhr.responseText;
            if (data !== null) {
                this.emitReserved("data", data);
                this.emitReserved("success");
                this.cleanup();
            }
        }
        /**
         * Aborts the request.
         *
         * @api public
         */
        abort() {
            this.cleanup();
        }
    }
    Request.requestsCount = 0;
    Request.requests = {};
    /**
     * Aborts pending requests when unloading the window. This is needed to prevent
     * memory leaks (e.g. when using IE) and to ensure that no spurious error is
     * emitted.
     */
    if (typeof document !== "undefined") {
        // @ts-ignore
        if (typeof attachEvent === "function") {
            // @ts-ignore
            attachEvent("onunload", unloadHandler);
        }
        else if (typeof addEventListener === "function") {
            const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
            addEventListener(terminationEvent, unloadHandler, false);
        }
    }
    function unloadHandler() {
        for (let i in Request.requests) {
            if (Request.requests.hasOwnProperty(i)) {
                Request.requests[i].abort();
            }
        }
    }

    const nextTick = (() => {
        const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
        if (isPromiseAvailable) {
            return cb => Promise.resolve().then(cb);
        }
        else {
            return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
        }
    })();
    const WebSocket = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
    const usingBrowserWebSocket = true;
    const defaultBinaryType = "arraybuffer";

    // detect ReactNative environment
    const isReactNative = typeof navigator !== "undefined" &&
        typeof navigator.product === "string" &&
        navigator.product.toLowerCase() === "reactnative";
    class WS extends Transport {
        /**
         * WebSocket transport constructor.
         *
         * @api {Object} connection options
         * @api public
         */
        constructor(opts) {
            super(opts);
            this.supportsBinary = !opts.forceBase64;
        }
        /**
         * Transport name.
         *
         * @api public
         */
        get name() {
            return "websocket";
        }
        /**
         * Opens socket.
         *
         * @api private
         */
        doOpen() {
            if (!this.check()) {
                // let probe timeout
                return;
            }
            const uri = this.uri();
            const protocols = this.opts.protocols;
            // React Native only supports the 'headers' option, and will print a warning if anything else is passed
            const opts = isReactNative
                ? {}
                : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
            if (this.opts.extraHeaders) {
                opts.headers = this.opts.extraHeaders;
            }
            try {
                this.ws =
                    usingBrowserWebSocket && !isReactNative
                        ? protocols
                            ? new WebSocket(uri, protocols)
                            : new WebSocket(uri)
                        : new WebSocket(uri, protocols, opts);
            }
            catch (err) {
                return this.emitReserved("error", err);
            }
            this.ws.binaryType = this.socket.binaryType || defaultBinaryType;
            this.addEventListeners();
        }
        /**
         * Adds event listeners to the socket
         *
         * @api private
         */
        addEventListeners() {
            this.ws.onopen = () => {
                if (this.opts.autoUnref) {
                    this.ws._socket.unref();
                }
                this.onOpen();
            };
            this.ws.onclose = closeEvent => this.onClose({
                description: "websocket connection closed",
                context: closeEvent
            });
            this.ws.onmessage = ev => this.onData(ev.data);
            this.ws.onerror = e => this.onError("websocket error", e);
        }
        /**
         * Writes data to socket.
         *
         * @param {Array} array of packets.
         * @api private
         */
        write(packets) {
            this.writable = false;
            // encodePacket efficient as it uses WS framing
            // no need for encodePayload
            for (let i = 0; i < packets.length; i++) {
                const packet = packets[i];
                const lastPacket = i === packets.length - 1;
                encodePacket(packet, this.supportsBinary, data => {
                    // always create a new object (GH-437)
                    const opts = {};
                    // Sometimes the websocket has already been closed but the browser didn't
                    // have a chance of informing us about it yet, in that case send will
                    // throw an error
                    try {
                        if (usingBrowserWebSocket) {
                            // TypeError is thrown when passing the second argument on Safari
                            this.ws.send(data);
                        }
                    }
                    catch (e) {
                    }
                    if (lastPacket) {
                        // fake drain
                        // defer to next tick to allow Socket to clear writeBuffer
                        nextTick(() => {
                            this.writable = true;
                            this.emitReserved("drain");
                        }, this.setTimeoutFn);
                    }
                });
            }
        }
        /**
         * Closes socket.
         *
         * @api private
         */
        doClose() {
            if (typeof this.ws !== "undefined") {
                this.ws.close();
                this.ws = null;
            }
        }
        /**
         * Generates uri for connection.
         *
         * @api private
         */
        uri() {
            let query = this.query || {};
            const schema = this.opts.secure ? "wss" : "ws";
            let port = "";
            // avoid port if default for schema
            if (this.opts.port &&
                (("wss" === schema && Number(this.opts.port) !== 443) ||
                    ("ws" === schema && Number(this.opts.port) !== 80))) {
                port = ":" + this.opts.port;
            }
            // append timestamp to URI
            if (this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast();
            }
            // communicate binary support capabilities
            if (!this.supportsBinary) {
                query.b64 = 1;
            }
            const encodedQuery = encode(query);
            const ipv6 = this.opts.hostname.indexOf(":") !== -1;
            return (schema +
                "://" +
                (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
                port +
                this.opts.path +
                (encodedQuery.length ? "?" + encodedQuery : ""));
        }
        /**
         * Feature detection for WebSocket.
         *
         * @return {Boolean} whether this transport is available.
         * @api public
         */
        check() {
            return !!WebSocket;
        }
    }

    const transports = {
        websocket: WS,
        polling: Polling
    };

    // imported from https://github.com/galkn/parseuri
    /**
     * Parses an URI
     *
     * @author Steven Levithan <stevenlevithan.com> (MIT license)
     * @api private
     */
    const re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
    const parts = [
        'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
    ];
    function parse(str) {
        const src = str, b = str.indexOf('['), e = str.indexOf(']');
        if (b != -1 && e != -1) {
            str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
        }
        let m = re.exec(str || ''), uri = {}, i = 14;
        while (i--) {
            uri[parts[i]] = m[i] || '';
        }
        if (b != -1 && e != -1) {
            uri.source = src;
            uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
            uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
            uri.ipv6uri = true;
        }
        uri.pathNames = pathNames(uri, uri['path']);
        uri.queryKey = queryKey(uri, uri['query']);
        return uri;
    }
    function pathNames(obj, path) {
        const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
        if (path.slice(0, 1) == '/' || path.length === 0) {
            names.splice(0, 1);
        }
        if (path.slice(-1) == '/') {
            names.splice(names.length - 1, 1);
        }
        return names;
    }
    function queryKey(uri, query) {
        const data = {};
        query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
            if ($1) {
                data[$1] = $2;
            }
        });
        return data;
    }

    class Socket$1 extends Emitter {
        /**
         * Socket constructor.
         *
         * @param {String|Object} uri or options
         * @param {Object} opts - options
         * @api public
         */
        constructor(uri, opts = {}) {
            super();
            if (uri && "object" === typeof uri) {
                opts = uri;
                uri = null;
            }
            if (uri) {
                uri = parse(uri);
                opts.hostname = uri.host;
                opts.secure = uri.protocol === "https" || uri.protocol === "wss";
                opts.port = uri.port;
                if (uri.query)
                    opts.query = uri.query;
            }
            else if (opts.host) {
                opts.hostname = parse(opts.host).host;
            }
            installTimerFunctions(this, opts);
            this.secure =
                null != opts.secure
                    ? opts.secure
                    : typeof location !== "undefined" && "https:" === location.protocol;
            if (opts.hostname && !opts.port) {
                // if no port is specified manually, use the protocol default
                opts.port = this.secure ? "443" : "80";
            }
            this.hostname =
                opts.hostname ||
                    (typeof location !== "undefined" ? location.hostname : "localhost");
            this.port =
                opts.port ||
                    (typeof location !== "undefined" && location.port
                        ? location.port
                        : this.secure
                            ? "443"
                            : "80");
            this.transports = opts.transports || ["polling", "websocket"];
            this.readyState = "";
            this.writeBuffer = [];
            this.prevBufferLen = 0;
            this.opts = Object.assign({
                path: "/engine.io",
                agent: false,
                withCredentials: false,
                upgrade: true,
                timestampParam: "t",
                rememberUpgrade: false,
                rejectUnauthorized: true,
                perMessageDeflate: {
                    threshold: 1024
                },
                transportOptions: {},
                closeOnBeforeunload: true
            }, opts);
            this.opts.path = this.opts.path.replace(/\/$/, "") + "/";
            if (typeof this.opts.query === "string") {
                this.opts.query = decode(this.opts.query);
            }
            // set on handshake
            this.id = null;
            this.upgrades = null;
            this.pingInterval = null;
            this.pingTimeout = null;
            // set on heartbeat
            this.pingTimeoutTimer = null;
            if (typeof addEventListener === "function") {
                if (this.opts.closeOnBeforeunload) {
                    // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
                    // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
                    // closed/reloaded)
                    this.beforeunloadEventListener = () => {
                        if (this.transport) {
                            // silently close the transport
                            this.transport.removeAllListeners();
                            this.transport.close();
                        }
                    };
                    addEventListener("beforeunload", this.beforeunloadEventListener, false);
                }
                if (this.hostname !== "localhost") {
                    this.offlineEventListener = () => {
                        this.onClose("transport close", {
                            description: "network connection lost"
                        });
                    };
                    addEventListener("offline", this.offlineEventListener, false);
                }
            }
            this.open();
        }
        /**
         * Creates transport of the given type.
         *
         * @param {String} transport name
         * @return {Transport}
         * @api private
         */
        createTransport(name) {
            const query = Object.assign({}, this.opts.query);
            // append engine.io protocol identifier
            query.EIO = protocol$1;
            // transport name
            query.transport = name;
            // session id if we already have one
            if (this.id)
                query.sid = this.id;
            const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
                query,
                socket: this,
                hostname: this.hostname,
                secure: this.secure,
                port: this.port
            });
            return new transports[name](opts);
        }
        /**
         * Initializes transport to use and starts probe.
         *
         * @api private
         */
        open() {
            let transport;
            if (this.opts.rememberUpgrade &&
                Socket$1.priorWebsocketSuccess &&
                this.transports.indexOf("websocket") !== -1) {
                transport = "websocket";
            }
            else if (0 === this.transports.length) {
                // Emit error on next tick so it can be listened to
                this.setTimeoutFn(() => {
                    this.emitReserved("error", "No transports available");
                }, 0);
                return;
            }
            else {
                transport = this.transports[0];
            }
            this.readyState = "opening";
            // Retry with the next transport if the transport is disabled (jsonp: false)
            try {
                transport = this.createTransport(transport);
            }
            catch (e) {
                this.transports.shift();
                this.open();
                return;
            }
            transport.open();
            this.setTransport(transport);
        }
        /**
         * Sets the current transport. Disables the existing one (if any).
         *
         * @api private
         */
        setTransport(transport) {
            if (this.transport) {
                this.transport.removeAllListeners();
            }
            // set up transport
            this.transport = transport;
            // set up transport listeners
            transport
                .on("drain", this.onDrain.bind(this))
                .on("packet", this.onPacket.bind(this))
                .on("error", this.onError.bind(this))
                .on("close", reason => this.onClose("transport close", reason));
        }
        /**
         * Probes a transport.
         *
         * @param {String} transport name
         * @api private
         */
        probe(name) {
            let transport = this.createTransport(name);
            let failed = false;
            Socket$1.priorWebsocketSuccess = false;
            const onTransportOpen = () => {
                if (failed)
                    return;
                transport.send([{ type: "ping", data: "probe" }]);
                transport.once("packet", msg => {
                    if (failed)
                        return;
                    if ("pong" === msg.type && "probe" === msg.data) {
                        this.upgrading = true;
                        this.emitReserved("upgrading", transport);
                        if (!transport)
                            return;
                        Socket$1.priorWebsocketSuccess = "websocket" === transport.name;
                        this.transport.pause(() => {
                            if (failed)
                                return;
                            if ("closed" === this.readyState)
                                return;
                            cleanup();
                            this.setTransport(transport);
                            transport.send([{ type: "upgrade" }]);
                            this.emitReserved("upgrade", transport);
                            transport = null;
                            this.upgrading = false;
                            this.flush();
                        });
                    }
                    else {
                        const err = new Error("probe error");
                        // @ts-ignore
                        err.transport = transport.name;
                        this.emitReserved("upgradeError", err);
                    }
                });
            };
            function freezeTransport() {
                if (failed)
                    return;
                // Any callback called by transport should be ignored since now
                failed = true;
                cleanup();
                transport.close();
                transport = null;
            }
            // Handle any error that happens while probing
            const onerror = err => {
                const error = new Error("probe error: " + err);
                // @ts-ignore
                error.transport = transport.name;
                freezeTransport();
                this.emitReserved("upgradeError", error);
            };
            function onTransportClose() {
                onerror("transport closed");
            }
            // When the socket is closed while we're probing
            function onclose() {
                onerror("socket closed");
            }
            // When the socket is upgraded while we're probing
            function onupgrade(to) {
                if (transport && to.name !== transport.name) {
                    freezeTransport();
                }
            }
            // Remove all listeners on the transport and on self
            const cleanup = () => {
                transport.removeListener("open", onTransportOpen);
                transport.removeListener("error", onerror);
                transport.removeListener("close", onTransportClose);
                this.off("close", onclose);
                this.off("upgrading", onupgrade);
            };
            transport.once("open", onTransportOpen);
            transport.once("error", onerror);
            transport.once("close", onTransportClose);
            this.once("close", onclose);
            this.once("upgrading", onupgrade);
            transport.open();
        }
        /**
         * Called when connection is deemed open.
         *
         * @api private
         */
        onOpen() {
            this.readyState = "open";
            Socket$1.priorWebsocketSuccess = "websocket" === this.transport.name;
            this.emitReserved("open");
            this.flush();
            // we check for `readyState` in case an `open`
            // listener already closed the socket
            if ("open" === this.readyState &&
                this.opts.upgrade &&
                this.transport.pause) {
                let i = 0;
                const l = this.upgrades.length;
                for (; i < l; i++) {
                    this.probe(this.upgrades[i]);
                }
            }
        }
        /**
         * Handles a packet.
         *
         * @api private
         */
        onPacket(packet) {
            if ("opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState) {
                this.emitReserved("packet", packet);
                // Socket is live - any packet counts
                this.emitReserved("heartbeat");
                switch (packet.type) {
                    case "open":
                        this.onHandshake(JSON.parse(packet.data));
                        break;
                    case "ping":
                        this.resetPingTimeout();
                        this.sendPacket("pong");
                        this.emitReserved("ping");
                        this.emitReserved("pong");
                        break;
                    case "error":
                        const err = new Error("server error");
                        // @ts-ignore
                        err.code = packet.data;
                        this.onError(err);
                        break;
                    case "message":
                        this.emitReserved("data", packet.data);
                        this.emitReserved("message", packet.data);
                        break;
                }
            }
        }
        /**
         * Called upon handshake completion.
         *
         * @param {Object} data - handshake obj
         * @api private
         */
        onHandshake(data) {
            this.emitReserved("handshake", data);
            this.id = data.sid;
            this.transport.query.sid = data.sid;
            this.upgrades = this.filterUpgrades(data.upgrades);
            this.pingInterval = data.pingInterval;
            this.pingTimeout = data.pingTimeout;
            this.maxPayload = data.maxPayload;
            this.onOpen();
            // In case open handler closes socket
            if ("closed" === this.readyState)
                return;
            this.resetPingTimeout();
        }
        /**
         * Sets and resets ping timeout timer based on server pings.
         *
         * @api private
         */
        resetPingTimeout() {
            this.clearTimeoutFn(this.pingTimeoutTimer);
            this.pingTimeoutTimer = this.setTimeoutFn(() => {
                this.onClose("ping timeout");
            }, this.pingInterval + this.pingTimeout);
            if (this.opts.autoUnref) {
                this.pingTimeoutTimer.unref();
            }
        }
        /**
         * Called on `drain` event
         *
         * @api private
         */
        onDrain() {
            this.writeBuffer.splice(0, this.prevBufferLen);
            // setting prevBufferLen = 0 is very important
            // for example, when upgrading, upgrade packet is sent over,
            // and a nonzero prevBufferLen could cause problems on `drain`
            this.prevBufferLen = 0;
            if (0 === this.writeBuffer.length) {
                this.emitReserved("drain");
            }
            else {
                this.flush();
            }
        }
        /**
         * Flush write buffers.
         *
         * @api private
         */
        flush() {
            if ("closed" !== this.readyState &&
                this.transport.writable &&
                !this.upgrading &&
                this.writeBuffer.length) {
                const packets = this.getWritablePackets();
                this.transport.send(packets);
                // keep track of current length of writeBuffer
                // splice writeBuffer and callbackBuffer on `drain`
                this.prevBufferLen = packets.length;
                this.emitReserved("flush");
            }
        }
        /**
         * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
         * long-polling)
         *
         * @private
         */
        getWritablePackets() {
            const shouldCheckPayloadSize = this.maxPayload &&
                this.transport.name === "polling" &&
                this.writeBuffer.length > 1;
            if (!shouldCheckPayloadSize) {
                return this.writeBuffer;
            }
            let payloadSize = 1; // first packet type
            for (let i = 0; i < this.writeBuffer.length; i++) {
                const data = this.writeBuffer[i].data;
                if (data) {
                    payloadSize += byteLength(data);
                }
                if (i > 0 && payloadSize > this.maxPayload) {
                    return this.writeBuffer.slice(0, i);
                }
                payloadSize += 2; // separator + packet type
            }
            return this.writeBuffer;
        }
        /**
         * Sends a message.
         *
         * @param {String} message.
         * @param {Function} callback function.
         * @param {Object} options.
         * @return {Socket} for chaining.
         * @api public
         */
        write(msg, options, fn) {
            this.sendPacket("message", msg, options, fn);
            return this;
        }
        send(msg, options, fn) {
            this.sendPacket("message", msg, options, fn);
            return this;
        }
        /**
         * Sends a packet.
         *
         * @param {String} packet type.
         * @param {String} data.
         * @param {Object} options.
         * @param {Function} callback function.
         * @api private
         */
        sendPacket(type, data, options, fn) {
            if ("function" === typeof data) {
                fn = data;
                data = undefined;
            }
            if ("function" === typeof options) {
                fn = options;
                options = null;
            }
            if ("closing" === this.readyState || "closed" === this.readyState) {
                return;
            }
            options = options || {};
            options.compress = false !== options.compress;
            const packet = {
                type: type,
                data: data,
                options: options
            };
            this.emitReserved("packetCreate", packet);
            this.writeBuffer.push(packet);
            if (fn)
                this.once("flush", fn);
            this.flush();
        }
        /**
         * Closes the connection.
         *
         * @api public
         */
        close() {
            const close = () => {
                this.onClose("forced close");
                this.transport.close();
            };
            const cleanupAndClose = () => {
                this.off("upgrade", cleanupAndClose);
                this.off("upgradeError", cleanupAndClose);
                close();
            };
            const waitForUpgrade = () => {
                // wait for upgrade to finish since we can't send packets while pausing a transport
                this.once("upgrade", cleanupAndClose);
                this.once("upgradeError", cleanupAndClose);
            };
            if ("opening" === this.readyState || "open" === this.readyState) {
                this.readyState = "closing";
                if (this.writeBuffer.length) {
                    this.once("drain", () => {
                        if (this.upgrading) {
                            waitForUpgrade();
                        }
                        else {
                            close();
                        }
                    });
                }
                else if (this.upgrading) {
                    waitForUpgrade();
                }
                else {
                    close();
                }
            }
            return this;
        }
        /**
         * Called upon transport error
         *
         * @api private
         */
        onError(err) {
            Socket$1.priorWebsocketSuccess = false;
            this.emitReserved("error", err);
            this.onClose("transport error", err);
        }
        /**
         * Called upon transport close.
         *
         * @api private
         */
        onClose(reason, description) {
            if ("opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState) {
                // clear timers
                this.clearTimeoutFn(this.pingTimeoutTimer);
                // stop event from firing again for transport
                this.transport.removeAllListeners("close");
                // ensure transport won't stay open
                this.transport.close();
                // ignore further transport communication
                this.transport.removeAllListeners();
                if (typeof removeEventListener === "function") {
                    removeEventListener("beforeunload", this.beforeunloadEventListener, false);
                    removeEventListener("offline", this.offlineEventListener, false);
                }
                // set ready state
                this.readyState = "closed";
                // clear session id
                this.id = null;
                // emit close event
                this.emitReserved("close", reason, description);
                // clean buffers after, so users can still
                // grab the buffers on `close` event
                this.writeBuffer = [];
                this.prevBufferLen = 0;
            }
        }
        /**
         * Filters upgrades, returning only those matching client transports.
         *
         * @param {Array} server upgrades
         * @api private
         *
         */
        filterUpgrades(upgrades) {
            const filteredUpgrades = [];
            let i = 0;
            const j = upgrades.length;
            for (; i < j; i++) {
                if (~this.transports.indexOf(upgrades[i]))
                    filteredUpgrades.push(upgrades[i]);
            }
            return filteredUpgrades;
        }
    }
    Socket$1.protocol = protocol$1;

    /**
     * URL parser.
     *
     * @param uri - url
     * @param path - the request path of the connection
     * @param loc - An object meant to mimic window.location.
     *        Defaults to window.location.
     * @public
     */
    function url(uri, path = "", loc) {
        let obj = uri;
        // default to window.location
        loc = loc || (typeof location !== "undefined" && location);
        if (null == uri)
            uri = loc.protocol + "//" + loc.host;
        // relative path support
        if (typeof uri === "string") {
            if ("/" === uri.charAt(0)) {
                if ("/" === uri.charAt(1)) {
                    uri = loc.protocol + uri;
                }
                else {
                    uri = loc.host + uri;
                }
            }
            if (!/^(https?|wss?):\/\//.test(uri)) {
                if ("undefined" !== typeof loc) {
                    uri = loc.protocol + "//" + uri;
                }
                else {
                    uri = "https://" + uri;
                }
            }
            // parse
            obj = parse(uri);
        }
        // make sure we treat `localhost:80` and `localhost` equally
        if (!obj.port) {
            if (/^(http|ws)$/.test(obj.protocol)) {
                obj.port = "80";
            }
            else if (/^(http|ws)s$/.test(obj.protocol)) {
                obj.port = "443";
            }
        }
        obj.path = obj.path || "/";
        const ipv6 = obj.host.indexOf(":") !== -1;
        const host = ipv6 ? "[" + obj.host + "]" : obj.host;
        // define unique id
        obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
        // define href
        obj.href =
            obj.protocol +
                "://" +
                host +
                (loc && loc.port === obj.port ? "" : ":" + obj.port);
        return obj;
    }

    const withNativeArrayBuffer = typeof ArrayBuffer === "function";
    const isView = (obj) => {
        return typeof ArrayBuffer.isView === "function"
            ? ArrayBuffer.isView(obj)
            : obj.buffer instanceof ArrayBuffer;
    };
    const toString = Object.prototype.toString;
    const withNativeBlob = typeof Blob === "function" ||
        (typeof Blob !== "undefined" &&
            toString.call(Blob) === "[object BlobConstructor]");
    const withNativeFile = typeof File === "function" ||
        (typeof File !== "undefined" &&
            toString.call(File) === "[object FileConstructor]");
    /**
     * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
     *
     * @private
     */
    function isBinary(obj) {
        return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
            (withNativeBlob && obj instanceof Blob) ||
            (withNativeFile && obj instanceof File));
    }
    function hasBinary(obj, toJSON) {
        if (!obj || typeof obj !== "object") {
            return false;
        }
        if (Array.isArray(obj)) {
            for (let i = 0, l = obj.length; i < l; i++) {
                if (hasBinary(obj[i])) {
                    return true;
                }
            }
            return false;
        }
        if (isBinary(obj)) {
            return true;
        }
        if (obj.toJSON &&
            typeof obj.toJSON === "function" &&
            arguments.length === 1) {
            return hasBinary(obj.toJSON(), true);
        }
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
     *
     * @param {Object} packet - socket.io event packet
     * @return {Object} with deconstructed packet and list of buffers
     * @public
     */
    function deconstructPacket(packet) {
        const buffers = [];
        const packetData = packet.data;
        const pack = packet;
        pack.data = _deconstructPacket(packetData, buffers);
        pack.attachments = buffers.length; // number of binary 'attachments'
        return { packet: pack, buffers: buffers };
    }
    function _deconstructPacket(data, buffers) {
        if (!data)
            return data;
        if (isBinary(data)) {
            const placeholder = { _placeholder: true, num: buffers.length };
            buffers.push(data);
            return placeholder;
        }
        else if (Array.isArray(data)) {
            const newData = new Array(data.length);
            for (let i = 0; i < data.length; i++) {
                newData[i] = _deconstructPacket(data[i], buffers);
            }
            return newData;
        }
        else if (typeof data === "object" && !(data instanceof Date)) {
            const newData = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    newData[key] = _deconstructPacket(data[key], buffers);
                }
            }
            return newData;
        }
        return data;
    }
    /**
     * Reconstructs a binary packet from its placeholder packet and buffers
     *
     * @param {Object} packet - event packet with placeholders
     * @param {Array} buffers - binary buffers to put in placeholder positions
     * @return {Object} reconstructed packet
     * @public
     */
    function reconstructPacket(packet, buffers) {
        packet.data = _reconstructPacket(packet.data, buffers);
        packet.attachments = undefined; // no longer useful
        return packet;
    }
    function _reconstructPacket(data, buffers) {
        if (!data)
            return data;
        if (data && data._placeholder === true) {
            const isIndexValid = typeof data.num === "number" &&
                data.num >= 0 &&
                data.num < buffers.length;
            if (isIndexValid) {
                return buffers[data.num]; // appropriate buffer (should be natural order anyway)
            }
            else {
                throw new Error("illegal attachments");
            }
        }
        else if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                data[i] = _reconstructPacket(data[i], buffers);
            }
        }
        else if (typeof data === "object") {
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    data[key] = _reconstructPacket(data[key], buffers);
                }
            }
        }
        return data;
    }

    /**
     * Protocol version.
     *
     * @public
     */
    const protocol = 5;
    var PacketType;
    (function (PacketType) {
        PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
        PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
        PacketType[PacketType["EVENT"] = 2] = "EVENT";
        PacketType[PacketType["ACK"] = 3] = "ACK";
        PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
        PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
        PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
    })(PacketType || (PacketType = {}));
    /**
     * A socket.io Encoder instance
     */
    class Encoder {
        /**
         * Encoder constructor
         *
         * @param {function} replacer - custom replacer to pass down to JSON.parse
         */
        constructor(replacer) {
            this.replacer = replacer;
        }
        /**
         * Encode a packet as a single string if non-binary, or as a
         * buffer sequence, depending on packet type.
         *
         * @param {Object} obj - packet object
         */
        encode(obj) {
            if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
                if (hasBinary(obj)) {
                    obj.type =
                        obj.type === PacketType.EVENT
                            ? PacketType.BINARY_EVENT
                            : PacketType.BINARY_ACK;
                    return this.encodeAsBinary(obj);
                }
            }
            return [this.encodeAsString(obj)];
        }
        /**
         * Encode packet as string.
         */
        encodeAsString(obj) {
            // first is type
            let str = "" + obj.type;
            // attachments if we have them
            if (obj.type === PacketType.BINARY_EVENT ||
                obj.type === PacketType.BINARY_ACK) {
                str += obj.attachments + "-";
            }
            // if we have a namespace other than `/`
            // we append it followed by a comma `,`
            if (obj.nsp && "/" !== obj.nsp) {
                str += obj.nsp + ",";
            }
            // immediately followed by the id
            if (null != obj.id) {
                str += obj.id;
            }
            // json data
            if (null != obj.data) {
                str += JSON.stringify(obj.data, this.replacer);
            }
            return str;
        }
        /**
         * Encode packet as 'buffer sequence' by removing blobs, and
         * deconstructing packet into object with placeholders and
         * a list of buffers.
         */
        encodeAsBinary(obj) {
            const deconstruction = deconstructPacket(obj);
            const pack = this.encodeAsString(deconstruction.packet);
            const buffers = deconstruction.buffers;
            buffers.unshift(pack); // add packet info to beginning of data list
            return buffers; // write all the buffers
        }
    }
    /**
     * A socket.io Decoder instance
     *
     * @return {Object} decoder
     */
    class Decoder extends Emitter {
        /**
         * Decoder constructor
         *
         * @param {function} reviver - custom reviver to pass down to JSON.stringify
         */
        constructor(reviver) {
            super();
            this.reviver = reviver;
        }
        /**
         * Decodes an encoded packet string into packet JSON.
         *
         * @param {String} obj - encoded packet
         */
        add(obj) {
            let packet;
            if (typeof obj === "string") {
                if (this.reconstructor) {
                    throw new Error("got plaintext data when reconstructing a packet");
                }
                packet = this.decodeString(obj);
                if (packet.type === PacketType.BINARY_EVENT ||
                    packet.type === PacketType.BINARY_ACK) {
                    // binary packet's json
                    this.reconstructor = new BinaryReconstructor(packet);
                    // no attachments, labeled binary but no binary data to follow
                    if (packet.attachments === 0) {
                        super.emitReserved("decoded", packet);
                    }
                }
                else {
                    // non-binary full packet
                    super.emitReserved("decoded", packet);
                }
            }
            else if (isBinary(obj) || obj.base64) {
                // raw binary data
                if (!this.reconstructor) {
                    throw new Error("got binary data when not reconstructing a packet");
                }
                else {
                    packet = this.reconstructor.takeBinaryData(obj);
                    if (packet) {
                        // received final buffer
                        this.reconstructor = null;
                        super.emitReserved("decoded", packet);
                    }
                }
            }
            else {
                throw new Error("Unknown type: " + obj);
            }
        }
        /**
         * Decode a packet String (JSON data)
         *
         * @param {String} str
         * @return {Object} packet
         */
        decodeString(str) {
            let i = 0;
            // look up type
            const p = {
                type: Number(str.charAt(0)),
            };
            if (PacketType[p.type] === undefined) {
                throw new Error("unknown packet type " + p.type);
            }
            // look up attachments if type binary
            if (p.type === PacketType.BINARY_EVENT ||
                p.type === PacketType.BINARY_ACK) {
                const start = i + 1;
                while (str.charAt(++i) !== "-" && i != str.length) { }
                const buf = str.substring(start, i);
                if (buf != Number(buf) || str.charAt(i) !== "-") {
                    throw new Error("Illegal attachments");
                }
                p.attachments = Number(buf);
            }
            // look up namespace (if any)
            if ("/" === str.charAt(i + 1)) {
                const start = i + 1;
                while (++i) {
                    const c = str.charAt(i);
                    if ("," === c)
                        break;
                    if (i === str.length)
                        break;
                }
                p.nsp = str.substring(start, i);
            }
            else {
                p.nsp = "/";
            }
            // look up id
            const next = str.charAt(i + 1);
            if ("" !== next && Number(next) == next) {
                const start = i + 1;
                while (++i) {
                    const c = str.charAt(i);
                    if (null == c || Number(c) != c) {
                        --i;
                        break;
                    }
                    if (i === str.length)
                        break;
                }
                p.id = Number(str.substring(start, i + 1));
            }
            // look up json data
            if (str.charAt(++i)) {
                const payload = this.tryParse(str.substr(i));
                if (Decoder.isPayloadValid(p.type, payload)) {
                    p.data = payload;
                }
                else {
                    throw new Error("invalid payload");
                }
            }
            return p;
        }
        tryParse(str) {
            try {
                return JSON.parse(str, this.reviver);
            }
            catch (e) {
                return false;
            }
        }
        static isPayloadValid(type, payload) {
            switch (type) {
                case PacketType.CONNECT:
                    return typeof payload === "object";
                case PacketType.DISCONNECT:
                    return payload === undefined;
                case PacketType.CONNECT_ERROR:
                    return typeof payload === "string" || typeof payload === "object";
                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                    return Array.isArray(payload) && payload.length > 0;
                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                    return Array.isArray(payload);
            }
        }
        /**
         * Deallocates a parser's resources
         */
        destroy() {
            if (this.reconstructor) {
                this.reconstructor.finishedReconstruction();
            }
        }
    }
    /**
     * A manager of a binary event's 'buffer sequence'. Should
     * be constructed whenever a packet of type BINARY_EVENT is
     * decoded.
     *
     * @param {Object} packet
     * @return {BinaryReconstructor} initialized reconstructor
     */
    class BinaryReconstructor {
        constructor(packet) {
            this.packet = packet;
            this.buffers = [];
            this.reconPack = packet;
        }
        /**
         * Method to be called when binary data received from connection
         * after a BINARY_EVENT packet.
         *
         * @param {Buffer | ArrayBuffer} binData - the raw binary data received
         * @return {null | Object} returns null if more binary data is expected or
         *   a reconstructed packet object if all buffers have been received.
         */
        takeBinaryData(binData) {
            this.buffers.push(binData);
            if (this.buffers.length === this.reconPack.attachments) {
                // done with buffer list
                const packet = reconstructPacket(this.reconPack, this.buffers);
                this.finishedReconstruction();
                return packet;
            }
            return null;
        }
        /**
         * Cleans up binary packet reconstruction variables.
         */
        finishedReconstruction() {
            this.reconPack = null;
            this.buffers = [];
        }
    }

    var parser = /*#__PURE__*/Object.freeze({
        __proto__: null,
        protocol: protocol,
        get PacketType () { return PacketType; },
        Encoder: Encoder,
        Decoder: Decoder
    });

    function on(obj, ev, fn) {
        obj.on(ev, fn);
        return function subDestroy() {
            obj.off(ev, fn);
        };
    }

    /**
     * Internal events.
     * These events can't be emitted by the user.
     */
    const RESERVED_EVENTS = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
        newListener: 1,
        removeListener: 1,
    });
    /**
     * A Socket is the fundamental class for interacting with the server.
     *
     * A Socket belongs to a certain Namespace (by default /) and uses an underlying {@link Manager} to communicate.
     *
     * @example
     * const socket = io();
     *
     * socket.on("connect", () => {
     *   console.log("connected");
     * });
     *
     * // send an event to the server
     * socket.emit("foo", "bar");
     *
     * socket.on("foobar", () => {
     *   // an event was received from the server
     * });
     *
     * // upon disconnection
     * socket.on("disconnect", (reason) => {
     *   console.log(`disconnected due to ${reason}`);
     * });
     */
    class Socket extends Emitter {
        /**
         * `Socket` constructor.
         */
        constructor(io, nsp, opts) {
            super();
            /**
             * Whether the socket is currently connected to the server.
             *
             * @example
             * const socket = io();
             *
             * socket.on("connect", () => {
             *   console.log(socket.connected); // true
             * });
             *
             * socket.on("disconnect", () => {
             *   console.log(socket.connected); // false
             * });
             */
            this.connected = false;
            /**
             * Buffer for packets received before the CONNECT packet
             */
            this.receiveBuffer = [];
            /**
             * Buffer for packets that will be sent once the socket is connected
             */
            this.sendBuffer = [];
            this.ids = 0;
            this.acks = {};
            this.flags = {};
            this.io = io;
            this.nsp = nsp;
            if (opts && opts.auth) {
                this.auth = opts.auth;
            }
            if (this.io._autoConnect)
                this.open();
        }
        /**
         * Whether the socket is currently disconnected
         *
         * @example
         * const socket = io();
         *
         * socket.on("connect", () => {
         *   console.log(socket.disconnected); // false
         * });
         *
         * socket.on("disconnect", () => {
         *   console.log(socket.disconnected); // true
         * });
         */
        get disconnected() {
            return !this.connected;
        }
        /**
         * Subscribe to open, close and packet events
         *
         * @private
         */
        subEvents() {
            if (this.subs)
                return;
            const io = this.io;
            this.subs = [
                on(io, "open", this.onopen.bind(this)),
                on(io, "packet", this.onpacket.bind(this)),
                on(io, "error", this.onerror.bind(this)),
                on(io, "close", this.onclose.bind(this)),
            ];
        }
        /**
         * Whether the Socket will try to reconnect when its Manager connects or reconnects.
         *
         * @example
         * const socket = io();
         *
         * console.log(socket.active); // true
         *
         * socket.on("disconnect", (reason) => {
         *   if (reason === "io server disconnect") {
         *     // the disconnection was initiated by the server, you need to manually reconnect
         *     console.log(socket.active); // false
         *   }
         *   // else the socket will automatically try to reconnect
         *   console.log(socket.active); // true
         * });
         */
        get active() {
            return !!this.subs;
        }
        /**
         * "Opens" the socket.
         *
         * @example
         * const socket = io({
         *   autoConnect: false
         * });
         *
         * socket.connect();
         */
        connect() {
            if (this.connected)
                return this;
            this.subEvents();
            if (!this.io["_reconnecting"])
                this.io.open(); // ensure open
            if ("open" === this.io._readyState)
                this.onopen();
            return this;
        }
        /**
         * Alias for {@link connect()}.
         */
        open() {
            return this.connect();
        }
        /**
         * Sends a `message` event.
         *
         * This method mimics the WebSocket.send() method.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
         *
         * @example
         * socket.send("hello");
         *
         * // this is equivalent to
         * socket.emit("message", "hello");
         *
         * @return self
         */
        send(...args) {
            args.unshift("message");
            this.emit.apply(this, args);
            return this;
        }
        /**
         * Override `emit`.
         * If the event is in `events`, it's emitted normally.
         *
         * @example
         * socket.emit("hello", "world");
         *
         * // all serializable datastructures are supported (no need to call JSON.stringify)
         * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
         *
         * // with an acknowledgement from the server
         * socket.emit("hello", "world", (val) => {
         *   // ...
         * });
         *
         * @return self
         */
        emit(ev, ...args) {
            if (RESERVED_EVENTS.hasOwnProperty(ev)) {
                throw new Error('"' + ev.toString() + '" is a reserved event name');
            }
            args.unshift(ev);
            const packet = {
                type: PacketType.EVENT,
                data: args,
            };
            packet.options = {};
            packet.options.compress = this.flags.compress !== false;
            // event ack callback
            if ("function" === typeof args[args.length - 1]) {
                const id = this.ids++;
                const ack = args.pop();
                this._registerAckCallback(id, ack);
                packet.id = id;
            }
            const isTransportWritable = this.io.engine &&
                this.io.engine.transport &&
                this.io.engine.transport.writable;
            const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
            if (discardPacket) ;
            else if (this.connected) {
                this.notifyOutgoingListeners(packet);
                this.packet(packet);
            }
            else {
                this.sendBuffer.push(packet);
            }
            this.flags = {};
            return this;
        }
        /**
         * @private
         */
        _registerAckCallback(id, ack) {
            const timeout = this.flags.timeout;
            if (timeout === undefined) {
                this.acks[id] = ack;
                return;
            }
            // @ts-ignore
            const timer = this.io.setTimeoutFn(() => {
                delete this.acks[id];
                for (let i = 0; i < this.sendBuffer.length; i++) {
                    if (this.sendBuffer[i].id === id) {
                        this.sendBuffer.splice(i, 1);
                    }
                }
                ack.call(this, new Error("operation has timed out"));
            }, timeout);
            this.acks[id] = (...args) => {
                // @ts-ignore
                this.io.clearTimeoutFn(timer);
                ack.apply(this, [null, ...args]);
            };
        }
        /**
         * Sends a packet.
         *
         * @param packet
         * @private
         */
        packet(packet) {
            packet.nsp = this.nsp;
            this.io._packet(packet);
        }
        /**
         * Called upon engine `open`.
         *
         * @private
         */
        onopen() {
            if (typeof this.auth == "function") {
                this.auth((data) => {
                    this.packet({ type: PacketType.CONNECT, data });
                });
            }
            else {
                this.packet({ type: PacketType.CONNECT, data: this.auth });
            }
        }
        /**
         * Called upon engine or manager `error`.
         *
         * @param err
         * @private
         */
        onerror(err) {
            if (!this.connected) {
                this.emitReserved("connect_error", err);
            }
        }
        /**
         * Called upon engine `close`.
         *
         * @param reason
         * @param description
         * @private
         */
        onclose(reason, description) {
            this.connected = false;
            delete this.id;
            this.emitReserved("disconnect", reason, description);
        }
        /**
         * Called with socket packet.
         *
         * @param packet
         * @private
         */
        onpacket(packet) {
            const sameNamespace = packet.nsp === this.nsp;
            if (!sameNamespace)
                return;
            switch (packet.type) {
                case PacketType.CONNECT:
                    if (packet.data && packet.data.sid) {
                        const id = packet.data.sid;
                        this.onconnect(id);
                    }
                    else {
                        this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                    }
                    break;
                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                    this.onevent(packet);
                    break;
                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                    this.onack(packet);
                    break;
                case PacketType.DISCONNECT:
                    this.ondisconnect();
                    break;
                case PacketType.CONNECT_ERROR:
                    this.destroy();
                    const err = new Error(packet.data.message);
                    // @ts-ignore
                    err.data = packet.data.data;
                    this.emitReserved("connect_error", err);
                    break;
            }
        }
        /**
         * Called upon a server event.
         *
         * @param packet
         * @private
         */
        onevent(packet) {
            const args = packet.data || [];
            if (null != packet.id) {
                args.push(this.ack(packet.id));
            }
            if (this.connected) {
                this.emitEvent(args);
            }
            else {
                this.receiveBuffer.push(Object.freeze(args));
            }
        }
        emitEvent(args) {
            if (this._anyListeners && this._anyListeners.length) {
                const listeners = this._anyListeners.slice();
                for (const listener of listeners) {
                    listener.apply(this, args);
                }
            }
            super.emit.apply(this, args);
        }
        /**
         * Produces an ack callback to emit with an event.
         *
         * @private
         */
        ack(id) {
            const self = this;
            let sent = false;
            return function (...args) {
                // prevent double callbacks
                if (sent)
                    return;
                sent = true;
                self.packet({
                    type: PacketType.ACK,
                    id: id,
                    data: args,
                });
            };
        }
        /**
         * Called upon a server acknowlegement.
         *
         * @param packet
         * @private
         */
        onack(packet) {
            const ack = this.acks[packet.id];
            if ("function" === typeof ack) {
                ack.apply(this, packet.data);
                delete this.acks[packet.id];
            }
        }
        /**
         * Called upon server connect.
         *
         * @private
         */
        onconnect(id) {
            this.id = id;
            this.connected = true;
            this.emitBuffered();
            this.emitReserved("connect");
        }
        /**
         * Emit buffered events (received and emitted).
         *
         * @private
         */
        emitBuffered() {
            this.receiveBuffer.forEach((args) => this.emitEvent(args));
            this.receiveBuffer = [];
            this.sendBuffer.forEach((packet) => {
                this.notifyOutgoingListeners(packet);
                this.packet(packet);
            });
            this.sendBuffer = [];
        }
        /**
         * Called upon server disconnect.
         *
         * @private
         */
        ondisconnect() {
            this.destroy();
            this.onclose("io server disconnect");
        }
        /**
         * Called upon forced client/server side disconnections,
         * this method ensures the manager stops tracking us and
         * that reconnections don't get triggered for this.
         *
         * @private
         */
        destroy() {
            if (this.subs) {
                // clean subscriptions to avoid reconnections
                this.subs.forEach((subDestroy) => subDestroy());
                this.subs = undefined;
            }
            this.io["_destroy"](this);
        }
        /**
         * Disconnects the socket manually. In that case, the socket will not try to reconnect.
         *
         * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
         *
         * @example
         * const socket = io();
         *
         * socket.on("disconnect", (reason) => {
         *   // console.log(reason); prints "io client disconnect"
         * });
         *
         * socket.disconnect();
         *
         * @return self
         */
        disconnect() {
            if (this.connected) {
                this.packet({ type: PacketType.DISCONNECT });
            }
            // remove socket from pool
            this.destroy();
            if (this.connected) {
                // fire events
                this.onclose("io client disconnect");
            }
            return this;
        }
        /**
         * Alias for {@link disconnect()}.
         *
         * @return self
         */
        close() {
            return this.disconnect();
        }
        /**
         * Sets the compress flag.
         *
         * @example
         * socket.compress(false).emit("hello");
         *
         * @param compress - if `true`, compresses the sending data
         * @return self
         */
        compress(compress) {
            this.flags.compress = compress;
            return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
         * ready to send messages.
         *
         * @example
         * socket.volatile.emit("hello"); // the server may or may not receive it
         *
         * @returns self
         */
        get volatile() {
            this.flags.volatile = true;
            return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
         * given number of milliseconds have elapsed without an acknowledgement from the server:
         *
         * @example
         * socket.timeout(5000).emit("my-event", (err) => {
         *   if (err) {
         *     // the server did not acknowledge the event in the given delay
         *   }
         * });
         *
         * @returns self
         */
        timeout(timeout) {
            this.flags.timeout = timeout;
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * @example
         * socket.onAny((event, ...args) => {
         *   console.log(`got ${event}`);
         * });
         *
         * @param listener
         */
        onAny(listener) {
            this._anyListeners = this._anyListeners || [];
            this._anyListeners.push(listener);
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * @example
         * socket.prependAny((event, ...args) => {
         *   console.log(`got event ${event}`);
         * });
         *
         * @param listener
         */
        prependAny(listener) {
            this._anyListeners = this._anyListeners || [];
            this._anyListeners.unshift(listener);
            return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @example
         * const catchAllListener = (event, ...args) => {
         *   console.log(`got event ${event}`);
         * }
         *
         * socket.onAny(catchAllListener);
         *
         * // remove a specific listener
         * socket.offAny(catchAllListener);
         *
         * // or remove all listeners
         * socket.offAny();
         *
         * @param listener
         */
        offAny(listener) {
            if (!this._anyListeners) {
                return this;
            }
            if (listener) {
                const listeners = this._anyListeners;
                for (let i = 0; i < listeners.length; i++) {
                    if (listener === listeners[i]) {
                        listeners.splice(i, 1);
                        return this;
                    }
                }
            }
            else {
                this._anyListeners = [];
            }
            return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         */
        listenersAny() {
            return this._anyListeners || [];
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * Note: acknowledgements sent to the server are not included.
         *
         * @example
         * socket.onAnyOutgoing((event, ...args) => {
         *   console.log(`sent event ${event}`);
         * });
         *
         * @param listener
         */
        onAnyOutgoing(listener) {
            this._anyOutgoingListeners = this._anyOutgoingListeners || [];
            this._anyOutgoingListeners.push(listener);
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * Note: acknowledgements sent to the server are not included.
         *
         * @example
         * socket.prependAnyOutgoing((event, ...args) => {
         *   console.log(`sent event ${event}`);
         * });
         *
         * @param listener
         */
        prependAnyOutgoing(listener) {
            this._anyOutgoingListeners = this._anyOutgoingListeners || [];
            this._anyOutgoingListeners.unshift(listener);
            return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @example
         * const catchAllListener = (event, ...args) => {
         *   console.log(`sent event ${event}`);
         * }
         *
         * socket.onAnyOutgoing(catchAllListener);
         *
         * // remove a specific listener
         * socket.offAnyOutgoing(catchAllListener);
         *
         * // or remove all listeners
         * socket.offAnyOutgoing();
         *
         * @param [listener] - the catch-all listener (optional)
         */
        offAnyOutgoing(listener) {
            if (!this._anyOutgoingListeners) {
                return this;
            }
            if (listener) {
                const listeners = this._anyOutgoingListeners;
                for (let i = 0; i < listeners.length; i++) {
                    if (listener === listeners[i]) {
                        listeners.splice(i, 1);
                        return this;
                    }
                }
            }
            else {
                this._anyOutgoingListeners = [];
            }
            return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         */
        listenersAnyOutgoing() {
            return this._anyOutgoingListeners || [];
        }
        /**
         * Notify the listeners for each packet sent
         *
         * @param packet
         *
         * @private
         */
        notifyOutgoingListeners(packet) {
            if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
                const listeners = this._anyOutgoingListeners.slice();
                for (const listener of listeners) {
                    listener.apply(this, packet.data);
                }
            }
        }
    }

    /**
     * Initialize backoff timer with `opts`.
     *
     * - `min` initial timeout in milliseconds [100]
     * - `max` max timeout [10000]
     * - `jitter` [0]
     * - `factor` [2]
     *
     * @param {Object} opts
     * @api public
     */
    function Backoff(opts) {
        opts = opts || {};
        this.ms = opts.min || 100;
        this.max = opts.max || 10000;
        this.factor = opts.factor || 2;
        this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
        this.attempts = 0;
    }
    /**
     * Return the backoff duration.
     *
     * @return {Number}
     * @api public
     */
    Backoff.prototype.duration = function () {
        var ms = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
            var rand = Math.random();
            var deviation = Math.floor(rand * this.jitter * ms);
            ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
        }
        return Math.min(ms, this.max) | 0;
    };
    /**
     * Reset the number of attempts.
     *
     * @api public
     */
    Backoff.prototype.reset = function () {
        this.attempts = 0;
    };
    /**
     * Set the minimum duration
     *
     * @api public
     */
    Backoff.prototype.setMin = function (min) {
        this.ms = min;
    };
    /**
     * Set the maximum duration
     *
     * @api public
     */
    Backoff.prototype.setMax = function (max) {
        this.max = max;
    };
    /**
     * Set the jitter
     *
     * @api public
     */
    Backoff.prototype.setJitter = function (jitter) {
        this.jitter = jitter;
    };

    class Manager extends Emitter {
        constructor(uri, opts) {
            var _a;
            super();
            this.nsps = {};
            this.subs = [];
            if (uri && "object" === typeof uri) {
                opts = uri;
                uri = undefined;
            }
            opts = opts || {};
            opts.path = opts.path || "/socket.io";
            this.opts = opts;
            installTimerFunctions(this, opts);
            this.reconnection(opts.reconnection !== false);
            this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
            this.reconnectionDelay(opts.reconnectionDelay || 1000);
            this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
            this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
            this.backoff = new Backoff({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor(),
            });
            this.timeout(null == opts.timeout ? 20000 : opts.timeout);
            this._readyState = "closed";
            this.uri = uri;
            const _parser = opts.parser || parser;
            this.encoder = new _parser.Encoder();
            this.decoder = new _parser.Decoder();
            this._autoConnect = opts.autoConnect !== false;
            if (this._autoConnect)
                this.open();
        }
        reconnection(v) {
            if (!arguments.length)
                return this._reconnection;
            this._reconnection = !!v;
            return this;
        }
        reconnectionAttempts(v) {
            if (v === undefined)
                return this._reconnectionAttempts;
            this._reconnectionAttempts = v;
            return this;
        }
        reconnectionDelay(v) {
            var _a;
            if (v === undefined)
                return this._reconnectionDelay;
            this._reconnectionDelay = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
            return this;
        }
        randomizationFactor(v) {
            var _a;
            if (v === undefined)
                return this._randomizationFactor;
            this._randomizationFactor = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
            return this;
        }
        reconnectionDelayMax(v) {
            var _a;
            if (v === undefined)
                return this._reconnectionDelayMax;
            this._reconnectionDelayMax = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
            return this;
        }
        timeout(v) {
            if (!arguments.length)
                return this._timeout;
            this._timeout = v;
            return this;
        }
        /**
         * Starts trying to reconnect if reconnection is enabled and we have not
         * started reconnecting yet
         *
         * @private
         */
        maybeReconnectOnOpen() {
            // Only try to reconnect if it's the first time we're connecting
            if (!this._reconnecting &&
                this._reconnection &&
                this.backoff.attempts === 0) {
                // keeps reconnection from firing twice for the same reconnection loop
                this.reconnect();
            }
        }
        /**
         * Sets the current transport `socket`.
         *
         * @param {Function} fn - optional, callback
         * @return self
         * @public
         */
        open(fn) {
            if (~this._readyState.indexOf("open"))
                return this;
            this.engine = new Socket$1(this.uri, this.opts);
            const socket = this.engine;
            const self = this;
            this._readyState = "opening";
            this.skipReconnect = false;
            // emit `open`
            const openSubDestroy = on(socket, "open", function () {
                self.onopen();
                fn && fn();
            });
            // emit `error`
            const errorSub = on(socket, "error", (err) => {
                self.cleanup();
                self._readyState = "closed";
                this.emitReserved("error", err);
                if (fn) {
                    fn(err);
                }
                else {
                    // Only do this if there is no fn to handle the error
                    self.maybeReconnectOnOpen();
                }
            });
            if (false !== this._timeout) {
                const timeout = this._timeout;
                if (timeout === 0) {
                    openSubDestroy(); // prevents a race condition with the 'open' event
                }
                // set timer
                const timer = this.setTimeoutFn(() => {
                    openSubDestroy();
                    socket.close();
                    // @ts-ignore
                    socket.emit("error", new Error("timeout"));
                }, timeout);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(function subDestroy() {
                    clearTimeout(timer);
                });
            }
            this.subs.push(openSubDestroy);
            this.subs.push(errorSub);
            return this;
        }
        /**
         * Alias for open()
         *
         * @return self
         * @public
         */
        connect(fn) {
            return this.open(fn);
        }
        /**
         * Called upon transport open.
         *
         * @private
         */
        onopen() {
            // clear old subs
            this.cleanup();
            // mark as open
            this._readyState = "open";
            this.emitReserved("open");
            // add new subs
            const socket = this.engine;
            this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
        }
        /**
         * Called upon a ping.
         *
         * @private
         */
        onping() {
            this.emitReserved("ping");
        }
        /**
         * Called with data.
         *
         * @private
         */
        ondata(data) {
            try {
                this.decoder.add(data);
            }
            catch (e) {
                this.onclose("parse error", e);
            }
        }
        /**
         * Called when parser fully decodes a packet.
         *
         * @private
         */
        ondecoded(packet) {
            // the nextTick call prevents an exception in a user-provided event listener from triggering a disconnection due to a "parse error"
            nextTick(() => {
                this.emitReserved("packet", packet);
            }, this.setTimeoutFn);
        }
        /**
         * Called upon socket error.
         *
         * @private
         */
        onerror(err) {
            this.emitReserved("error", err);
        }
        /**
         * Creates a new socket for the given `nsp`.
         *
         * @return {Socket}
         * @public
         */
        socket(nsp, opts) {
            let socket = this.nsps[nsp];
            if (!socket) {
                socket = new Socket(this, nsp, opts);
                this.nsps[nsp] = socket;
            }
            return socket;
        }
        /**
         * Called upon a socket close.
         *
         * @param socket
         * @private
         */
        _destroy(socket) {
            const nsps = Object.keys(this.nsps);
            for (const nsp of nsps) {
                const socket = this.nsps[nsp];
                if (socket.active) {
                    return;
                }
            }
            this._close();
        }
        /**
         * Writes a packet.
         *
         * @param packet
         * @private
         */
        _packet(packet) {
            const encodedPackets = this.encoder.encode(packet);
            for (let i = 0; i < encodedPackets.length; i++) {
                this.engine.write(encodedPackets[i], packet.options);
            }
        }
        /**
         * Clean up transport subscriptions and packet buffer.
         *
         * @private
         */
        cleanup() {
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs.length = 0;
            this.decoder.destroy();
        }
        /**
         * Close the current socket.
         *
         * @private
         */
        _close() {
            this.skipReconnect = true;
            this._reconnecting = false;
            this.onclose("forced close");
            if (this.engine)
                this.engine.close();
        }
        /**
         * Alias for close()
         *
         * @private
         */
        disconnect() {
            return this._close();
        }
        /**
         * Called upon engine close.
         *
         * @private
         */
        onclose(reason, description) {
            this.cleanup();
            this.backoff.reset();
            this._readyState = "closed";
            this.emitReserved("close", reason, description);
            if (this._reconnection && !this.skipReconnect) {
                this.reconnect();
            }
        }
        /**
         * Attempt a reconnection.
         *
         * @private
         */
        reconnect() {
            if (this._reconnecting || this.skipReconnect)
                return this;
            const self = this;
            if (this.backoff.attempts >= this._reconnectionAttempts) {
                this.backoff.reset();
                this.emitReserved("reconnect_failed");
                this._reconnecting = false;
            }
            else {
                const delay = this.backoff.duration();
                this._reconnecting = true;
                const timer = this.setTimeoutFn(() => {
                    if (self.skipReconnect)
                        return;
                    this.emitReserved("reconnect_attempt", self.backoff.attempts);
                    // check again for the case socket closed in above events
                    if (self.skipReconnect)
                        return;
                    self.open((err) => {
                        if (err) {
                            self._reconnecting = false;
                            self.reconnect();
                            this.emitReserved("reconnect_error", err);
                        }
                        else {
                            self.onreconnect();
                        }
                    });
                }, delay);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(function subDestroy() {
                    clearTimeout(timer);
                });
            }
        }
        /**
         * Called upon successful reconnect.
         *
         * @private
         */
        onreconnect() {
            const attempt = this.backoff.attempts;
            this._reconnecting = false;
            this.backoff.reset();
            this.emitReserved("reconnect", attempt);
        }
    }

    /**
     * Managers cache.
     */
    const cache = {};
    function lookup(uri, opts) {
        if (typeof uri === "object") {
            opts = uri;
            uri = undefined;
        }
        opts = opts || {};
        const parsed = url(uri, opts.path || "/socket.io");
        const source = parsed.source;
        const id = parsed.id;
        const path = parsed.path;
        const sameNamespace = cache[id] && path in cache[id]["nsps"];
        const newConnection = opts.forceNew ||
            opts["force new connection"] ||
            false === opts.multiplex ||
            sameNamespace;
        let io;
        if (newConnection) {
            io = new Manager(source, opts);
        }
        else {
            if (!cache[id]) {
                cache[id] = new Manager(source, opts);
            }
            io = cache[id];
        }
        if (parsed.query && !opts.query) {
            opts.query = parsed.queryKey;
        }
        return io.socket(parsed.path, opts);
    }
    // so that "lookup" can be used both as a function (e.g. `io(...)`) and as a
    // namespace (e.g. `io.connect(...)`), for backward compatibility
    Object.assign(lookup, {
        Manager,
        Socket,
        io: lookup,
        connect: lookup,
    });

    const page = writable('home');
    const loading = writable(false);

    //export const socket = writable(io('http://localhost:5000'))
    const socket = writable(lookup('bengomez.me'));

    const socketStatus = writable(0); //ON: 1, OFF: 0, ERROR: -1

    const currentUser = writable({});

    /* src\components\Header.svelte generated by Svelte v3.55.1 */
    const file$h = "src\\components\\Header.svelte";

    // (54:8) {#if $currentUser._id}
    function create_if_block$a(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Logout";
    			attr_dev(button, "class", "svelte-v9vecw");
    			add_location(button, file$h, 54, 10, 1408);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(54:8) {#if $currentUser._id}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let header;
    	let span0;
    	let t0;
    	let span2;
    	let div1;
    	let div0;
    	let button0;
    	let t2;
    	let span1;
    	let nav;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let button1;
    	let t5;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t6;
    	let ul;
    	let button2;
    	let t7_value = (/*$currentUser*/ ctx[1]._id ? 'Profile' : 'Login') + "";
    	let t7;
    	let t8;
    	let t9;
    	let span3;
    	let mounted;
    	let dispose;
    	let if_block = /*$currentUser*/ ctx[1]._id && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			span0 = element("span");
    			t0 = space();
    			span2 = element("span");
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "BenGomez.me";
    			t2 = space();
    			span1 = element("span");
    			nav = element("nav");
    			img0 = element("img");
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Menu";
    			t5 = space();
    			div2 = element("div");
    			img1 = element("img");
    			t6 = space();
    			ul = element("ul");
    			button2 = element("button");
    			t7 = text(t7_value);
    			t8 = space();
    			if (if_block) if_block.c();
    			t9 = space();
    			span3 = element("span");
    			attr_dev(span0, "class", "pad svelte-v9vecw");
    			add_location(span0, file$h, 17, 2, 414);
    			attr_dev(button0, "class", "logo svelte-v9vecw");
    			add_location(button0, file$h, 22, 8, 513);
    			add_location(div0, file$h, 21, 6, 498);
    			attr_dev(div1, "class", "logo-wrap svelte-v9vecw");
    			add_location(div1, file$h, 20, 4, 467);
    			if (!src_url_equal(img0.src, img0_src_value = "assets/images/notch.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "notch.svg");
    			attr_dev(img0, "class", "svelte-v9vecw");
    			add_location(img0, file$h, 30, 8, 690);
    			attr_dev(button1, "class", "menu-btn svelte-v9vecw");
    			attr_dev(button1, "id", "menuBtn");
    			add_location(button1, file$h, 31, 8, 753);
    			attr_dev(nav, "class", "svelte-v9vecw");
    			add_location(nav, file$h, 29, 6, 675);
    			attr_dev(span1, "class", "nav-wrap svelte-v9vecw");
    			add_location(span1, file$h, 28, 4, 644);
    			attr_dev(img1, "class", "SD-card svelte-v9vecw");
    			if (!src_url_equal(img1.src, img1_src_value = "assets/images/SDcard.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "SD.svg");
    			add_location(img1, file$h, 37, 6, 910);
    			attr_dev(button2, "class", "svelte-v9vecw");
    			add_location(button2, file$h, 45, 8, 1120);
    			attr_dev(ul, "class", "SD-list svelte-v9vecw");
    			attr_dev(ul, "id", "navList");
    			add_location(ul, file$h, 44, 6, 1077);
    			attr_dev(div2, "class", "SD-wrap hide-menu svelte-v9vecw");
    			add_location(div2, file$h, 36, 4, 871);
    			attr_dev(span2, "class", "center svelte-v9vecw");
    			add_location(span2, file$h, 19, 2, 440);
    			attr_dev(span3, "class", "pad svelte-v9vecw");
    			add_location(span3, file$h, 67, 2, 1674);
    			attr_dev(header, "class", "svelte-v9vecw");
    			add_location(header, file$h, 16, 0, 402);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, span0);
    			append_dev(header, t0);
    			append_dev(header, span2);
    			append_dev(span2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(span2, t2);
    			append_dev(span2, span1);
    			append_dev(span1, nav);
    			append_dev(nav, img0);
    			append_dev(nav, t3);
    			append_dev(nav, button1);
    			append_dev(span2, t5);
    			append_dev(span2, div2);
    			append_dev(div2, img1);
    			append_dev(div2, t6);
    			append_dev(div2, ul);
    			append_dev(ul, button2);
    			append_dev(button2, t7);
    			/*button2_binding*/ ctx[5](button2);
    			append_dev(ul, t8);
    			if (if_block) if_block.m(ul, null);
    			append_dev(header, t9);
    			append_dev(header, span3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*toggleMenu*/ ctx[2], false, false, false),
    					listen_dev(img1, "click", /*toggleMenu*/ ctx[2], false, false, false),
    					listen_dev(img1, "keydown", null, false, false, false),
    					listen_dev(button2, "click", /*click_handler_1*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$currentUser*/ 2 && t7_value !== (t7_value = (/*$currentUser*/ ctx[1]._id ? 'Profile' : 'Login') + "")) set_data_dev(t7, t7_value);

    			if (/*$currentUser*/ ctx[1]._id) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			/*button2_binding*/ ctx[5](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $page;
    	let $currentUser;
    	validate_store(page, 'page');
    	component_subscribe($$self, page, $$value => $$invalidate(0, $page = $$value));
    	validate_store(currentUser, 'currentUser');
    	component_subscribe($$self, currentUser, $$value => $$invalidate(1, $currentUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);

    	const toggleMenu = () => {
    		const firstListItem = document.querySelector('ul > button');
    		firstListItem.focus();
    	};

    	const switchPage = targetPage => {
    		set_store_value(page, $page = targetPage, $page);
    		document.getElementById('menuBtn').focus();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => set_store_value(page, $page = 'home', $page);

    	function button2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$currentUser = $$value;
    			currentUser.set($currentUser);
    		});
    	}

    	const click_handler_1 = () => {
    		$currentUser._id
    		? switchPage('profile')
    		: switchPage('login');
    	};

    	const click_handler_2 = () => {
    		switchPage('home');
    		set_store_value(currentUser, $currentUser = {}, $currentUser);
    		localStorage.clear();
    	};

    	$$self.$capture_state = () => ({
    		page,
    		currentUser,
    		toggleMenu,
    		switchPage,
    		$page,
    		$currentUser
    	});

    	return [
    		$page,
    		$currentUser,
    		toggleMenu,
    		switchPage,
    		click_handler,
    		button2_binding,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\components\modal.svelte generated by Svelte v3.55.1 */

    const file$g = "src\\components\\modal.svelte";

    // (3:8)       
    function fallback_block(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Modal";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Nothing slotted";
    			add_location(h1, file$g, 4, 6, 112);
    			add_location(p, file$g, 5, 6, 134);
    			add_location(div, file$g, 3, 4, 99);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(3:8)       ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let dialog;
    	let button;
    	let t1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			dialog = element("dialog");
    			button = element("button");
    			button.textContent = "×";
    			t1 = space();
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(button, "class", "exit svelte-1m5emv2");
    			add_location(button, file$g, 1, 2, 47);
    			attr_dev(dialog, "class", "container modal svelte-1m5emv2");
    			attr_dev(dialog, "id", "modal");
    			add_location(dialog, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dialog, anchor);
    			append_dev(dialog, button);
    			append_dev(dialog, t1);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(dialog, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dialog);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\MorseDecoder.svelte generated by Svelte v3.55.1 */

    const file$f = "src\\components\\MorseDecoder.svelte";

    // (155:2) {#if props.full === true}
    function create_if_block$9(ctx) {
    	let div;
    	let h10;
    	let t1;
    	let p;
    	let t2;
    	let br0;
    	let t3;
    	let br1;
    	let t4;
    	let t5;
    	let br2;
    	let t6;
    	let br3;
    	let t7;
    	let h11;
    	let t9;
    	let table;
    	let tr0;
    	let th0;
    	let t11;
    	let td0;
    	let input;
    	let t12;
    	let t13;
    	let tr1;
    	let th1;
    	let t15;
    	let td1;
    	let t16;
    	let t17;
    	let t18;
    	let t19;
    	let tr2;
    	let th2;
    	let t21;
    	let td2;
    	let t22;
    	let t23;
    	let t24;
    	let t25;
    	let tr3;
    	let th3;
    	let t27;
    	let td3;
    	let t28;
    	let t29;
    	let t30;
    	let t31;
    	let tr4;
    	let th4;
    	let t33;
    	let td4;
    	let t34;
    	let t35;
    	let t36;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h10 = element("h1");
    			h10.textContent = "How To Use";
    			t1 = space();
    			p = element("p");
    			t2 = text("Click on screen and type. ");
    			br0 = element("br");
    			t3 = text("\r\n        Use periods(.) for Dots and hyphens(-) for Dashes. ");
    			br1 = element("br");
    			t4 = text("\r\n        Press Enter to Encode or Decode.");
    			t5 = space();
    			br2 = element("br");
    			t6 = space();
    			br3 = element("br");
    			t7 = space();
    			h11 = element("h1");
    			h11.textContent = "Settings";
    			t9 = space();
    			table = element("table");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Dot Length";
    			t11 = space();
    			td0 = element("td");
    			input = element("input");
    			t12 = text(" ms");
    			t13 = space();
    			tr1 = element("tr");
    			th1 = element("th");
    			th1.textContent = "Dash Length";
    			t15 = space();
    			td1 = element("td");
    			t16 = text("3 x dotLength = ");
    			t17 = text(/*dashLength*/ ctx[2]);
    			t18 = text("ms");
    			t19 = space();
    			tr2 = element("tr");
    			th2 = element("th");
    			th2.textContent = "Gap Between Dots";
    			t21 = space();
    			td2 = element("td");
    			t22 = text("1 x dotLength = ");
    			t23 = text(/*charGapLength*/ ctx[3]);
    			t24 = text("ms");
    			t25 = space();
    			tr3 = element("tr");
    			th3 = element("th");
    			th3.textContent = "Gap Between Letters";
    			t27 = space();
    			td3 = element("td");
    			t28 = text("3 x dotLength = ");
    			t29 = text(/*letterGapLength*/ ctx[4]);
    			t30 = text("ms");
    			t31 = space();
    			tr4 = element("tr");
    			th4 = element("th");
    			th4.textContent = "Gap Between Words";
    			t33 = space();
    			td4 = element("td");
    			t34 = text("7 x dotLength = ");
    			t35 = text(/*wordGapLength*/ ctx[5]);
    			t36 = text("ms");
    			add_location(h10, file$f, 156, 6, 3549);
    			add_location(br0, file$f, 158, 34, 3615);
    			add_location(br1, file$f, 159, 59, 3682);
    			add_location(p, file$f, 157, 6, 3576);
    			add_location(br2, file$f, 162, 6, 3750);
    			add_location(br3, file$f, 163, 6, 3764);
    			add_location(h11, file$f, 164, 6, 3778);
    			attr_dev(th0, "class", "svelte-1crtz5m");
    			add_location(th0, file$f, 167, 10, 3836);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", "10000");
    			input.value = /*dotLength*/ ctx[1];
    			attr_dev(input, "class", "svelte-1crtz5m");
    			add_location(input, file$f, 169, 12, 3885);
    			attr_dev(td0, "class", "svelte-1crtz5m");
    			add_location(td0, file$f, 168, 10, 3867);
    			attr_dev(tr0, "class", "svelte-1crtz5m");
    			add_location(tr0, file$f, 166, 8, 3820);
    			attr_dev(th1, "class", "svelte-1crtz5m");
    			add_location(th1, file$f, 179, 10, 4123);
    			attr_dev(td1, "class", "svelte-1crtz5m");
    			add_location(td1, file$f, 180, 10, 4155);
    			attr_dev(tr1, "class", "svelte-1crtz5m");
    			add_location(tr1, file$f, 178, 8, 4107);
    			attr_dev(th2, "class", "svelte-1crtz5m");
    			add_location(th2, file$f, 183, 10, 4235);
    			attr_dev(td2, "class", "svelte-1crtz5m");
    			add_location(td2, file$f, 184, 10, 4272);
    			attr_dev(tr2, "class", "svelte-1crtz5m");
    			add_location(tr2, file$f, 182, 8, 4219);
    			attr_dev(th3, "class", "svelte-1crtz5m");
    			add_location(th3, file$f, 187, 10, 4355);
    			attr_dev(td3, "class", "svelte-1crtz5m");
    			add_location(td3, file$f, 188, 10, 4395);
    			attr_dev(tr3, "class", "svelte-1crtz5m");
    			add_location(tr3, file$f, 186, 8, 4339);
    			attr_dev(th4, "class", "svelte-1crtz5m");
    			add_location(th4, file$f, 191, 10, 4480);
    			attr_dev(td4, "class", "svelte-1crtz5m");
    			add_location(td4, file$f, 192, 10, 4518);
    			attr_dev(tr4, "class", "svelte-1crtz5m");
    			add_location(tr4, file$f, 190, 8, 4464);
    			attr_dev(table, "class", "svelte-1crtz5m");
    			add_location(table, file$f, 165, 6, 3803);
    			attr_dev(div, "class", "settings glass svelte-1crtz5m");
    			add_location(div, file$f, 155, 4, 3513);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h10);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(p, br0);
    			append_dev(p, t3);
    			append_dev(p, br1);
    			append_dev(p, t4);
    			append_dev(div, t5);
    			append_dev(div, br2);
    			append_dev(div, t6);
    			append_dev(div, br3);
    			append_dev(div, t7);
    			append_dev(div, h11);
    			append_dev(div, t9);
    			append_dev(div, table);
    			append_dev(table, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t11);
    			append_dev(tr0, td0);
    			append_dev(td0, input);
    			append_dev(td0, t12);
    			append_dev(table, t13);
    			append_dev(table, tr1);
    			append_dev(tr1, th1);
    			append_dev(tr1, t15);
    			append_dev(tr1, td1);
    			append_dev(td1, t16);
    			append_dev(td1, t17);
    			append_dev(td1, t18);
    			append_dev(table, t19);
    			append_dev(table, tr2);
    			append_dev(tr2, th2);
    			append_dev(tr2, t21);
    			append_dev(tr2, td2);
    			append_dev(td2, t22);
    			append_dev(td2, t23);
    			append_dev(td2, t24);
    			append_dev(table, t25);
    			append_dev(table, tr3);
    			append_dev(tr3, th3);
    			append_dev(tr3, t27);
    			append_dev(tr3, td3);
    			append_dev(td3, t28);
    			append_dev(td3, t29);
    			append_dev(td3, t30);
    			append_dev(table, t31);
    			append_dev(table, tr4);
    			append_dev(tr4, th4);
    			append_dev(tr4, t33);
    			append_dev(tr4, td4);
    			append_dev(td4, t34);
    			append_dev(td4, t35);
    			append_dev(td4, t36);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*updateDotLength*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dotLength*/ 2 && input.value !== /*dotLength*/ ctx[1]) {
    				prop_dev(input, "value", /*dotLength*/ ctx[1]);
    			}

    			if (dirty & /*dashLength*/ 4) set_data_dev(t17, /*dashLength*/ ctx[2]);
    			if (dirty & /*charGapLength*/ 8) set_data_dev(t23, /*charGapLength*/ ctx[3]);
    			if (dirty & /*letterGapLength*/ 16) set_data_dev(t29, /*letterGapLength*/ ctx[4]);
    			if (dirty & /*wordGapLength*/ 32) set_data_dev(t35, /*wordGapLength*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(155:2) {#if props.full === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let section;
    	let div6;
    	let div4;
    	let textarea;
    	let t0;
    	let div3;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let div5;
    	let button0;
    	let t5;
    	let button1;
    	let t7;
    	let button2;
    	let t8;
    	let mounted;
    	let dispose;
    	let if_block = /*props*/ ctx[0].full === true && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div6 = element("div");
    			div4 = element("div");
    			textarea = element("textarea");
    			t0 = space();
    			div3 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div5 = element("div");
    			button0 = element("button");
    			button0.textContent = "×";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "↵";
    			t7 = space();
    			button2 = element("button");
    			t8 = space();
    			if (if_block) if_block.c();
    			attr_dev(textarea, "placeholder", "Type Here...");
    			attr_dev(textarea, "id", "input");
    			attr_dev(textarea, "class", "svelte-1crtz5m");
    			add_location(textarea, file$f, 135, 6, 2987);
    			attr_dev(div0, "class", "groove svelte-1crtz5m");
    			add_location(div0, file$f, 137, 8, 3080);
    			attr_dev(div1, "class", "groove svelte-1crtz5m");
    			add_location(div1, file$f, 138, 8, 3112);
    			attr_dev(div2, "class", "groove svelte-1crtz5m");
    			add_location(div2, file$f, 139, 8, 3144);
    			attr_dev(div3, "class", "groove-wrap svelte-1crtz5m");
    			add_location(div3, file$f, 136, 6, 3045);
    			attr_dev(div4, "class", "screen svelte-1crtz5m");
    			add_location(div4, file$f, 134, 4, 2959);
    			attr_dev(button0, "class", "svelte-1crtz5m");
    			add_location(button0, file$f, 143, 6, 3231);
    			attr_dev(button1, "class", "svelte-1crtz5m");
    			add_location(button1, file$f, 144, 6, 3279);
    			attr_dev(div5, "class", "button-wrap svelte-1crtz5m");
    			add_location(div5, file$f, 142, 4, 3198);
    			attr_dev(button2, "class", "spacebar pressed svelte-1crtz5m");
    			attr_dev(button2, "id", "spacebar");
    			add_location(button2, file$f, 146, 4, 3338);
    			attr_dev(div6, "class", "device svelte-1crtz5m");
    			add_location(div6, file$f, 133, 2, 2912);
    			attr_dev(section, "class", "morse-decoder svelte-1crtz5m");
    			add_location(section, file$f, 132, 0, 2877);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div6);
    			append_dev(div6, div4);
    			append_dev(div4, textarea);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, button0);
    			append_dev(div5, t5);
    			append_dev(div5, button1);
    			append_dev(div6, t7);
    			append_dev(div6, button2);
    			append_dev(section, t8);
    			if (if_block) if_block.m(section, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*clear*/ ctx[10], false, false, false),
    					listen_dev(button1, "click", /*check*/ ctx[11], false, false, false),
    					listen_dev(button2, "mousedown", /*pressed*/ ctx[8], false, false, false),
    					listen_dev(button2, "mouseup", /*unpressed*/ ctx[9], false, false, false),
    					listen_dev(div6, "keydown", /*keyDown*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*props*/ ctx[0].full === true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(section, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MorseDecoder', slots, []);
    	let { props = { full: false } } = $$props;

    	let morseCode = [
    		['-----', '0'],
    		['.----', '1'],
    		['..---', '2'],
    		['...--', '3'],
    		['....-', '4'],
    		['.....', '5'],
    		['-....', '6'],
    		['--...', '7'],
    		['---..', '8'],
    		['----.', '9'],
    		['.-', 'a'],
    		['-...', 'b'],
    		['-.-.', 'c'],
    		['-..', 'd'],
    		['.', 'e'],
    		['..-.', 'f'],
    		['--.', 'g'],
    		['....', 'h'],
    		['..', 'i'],
    		['.---', 'j'],
    		['-.-', 'k'],
    		['.-..', 'l'],
    		['--', 'm'],
    		['-.', 'n'],
    		['---', 'o'],
    		['.--.', 'p'],
    		['--.-', 'q'],
    		['.-.', 'r'],
    		['...', 's'],
    		['-', 't'],
    		['..-', 'u'],
    		['...-', 'v'],
    		['.--', 'w'],
    		['-..-', 'x'],
    		['-.--', 'y'],
    		['--..', 'z'],
    		['/', ' '],
    		['-.-.--', '!'],
    		['.-.-.-', '.'],
    		['--..--', ','],
    		['-....-', '-']
    	];

    	let dotLength = 500; //ms
    	let dashLength = 3 * dotLength;
    	let charGapLength = dotLength;
    	let letterGapLength = 3 * dotLength;
    	let wordGapLength = 7 * dotLength;

    	const updateDotLength = e => {
    		$$invalidate(1, dotLength = e.target.value);
    		$$invalidate(2, dashLength = 3 * dotLength);
    		$$invalidate(3, charGapLength = dotLength);
    		$$invalidate(4, letterGapLength = 3 * dotLength);
    		$$invalidate(5, wordGapLength = 7 * dotLength);
    	};

    	//Buttons
    	const keyDown = e => {
    		if (e.key === 'Enter') {
    			e.preventDefault();
    			check();
    		}
    	};

    	let keyDownTime = 0;

    	const pressed = () => {
    		keyDownTime = new Date();
    	};

    	const unpressed = () => {
    		const lengthOfPress = new Date() - keyDownTime;

    		// console.log(lengthOfPress)
    		lengthOfPress < dotLength
    		? document.getElementById('input').value += '.'
    		: document.getElementById('input').value += '-';
    	};

    	const clear = () => {
    		document.getElementById('input').value = '';
    	};

    	//Morse
    	function check() {
    		const input = document.getElementById('input');
    		let output;
    		input.value = input.value.trim();

    		input.value.match(/^[\.\-\/\s]+$/)
    		? output = decode(input.value)
    		: output = encode(input.value);

    		input.value = '';
    		input.value = output.toUpperCase();
    	}

    	function decode(value) {
    		let output = '';
    		let morse = [];
    		morse = value.match(/([\.\/-]+)/g);

    		for (let i = 0; i < morse.length; i++) {
    			for (let j = 0; j < morseCode.length; j++) {
    				if (morse[i] == morseCode[j][0]) {
    					output += morseCode[j][1];
    				}
    			}
    		}

    		return output;
    	}

    	function encode(value) {
    		let output = '';
    		let char = [];
    		char = value.toLowerCase().split('');

    		for (let i = 0; i < char.length; i++) {
    			for (let j = 0; j < morseCode.length; j++) {
    				if (char[i] == morseCode[j][1]) {
    					output += morseCode[j][0] + ' ';
    				}
    			}
    		}

    		return output;
    	}

    	const writable_props = ['props'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MorseDecoder> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('props' in $$props) $$invalidate(0, props = $$props.props);
    	};

    	$$self.$capture_state = () => ({
    		props,
    		morseCode,
    		dotLength,
    		dashLength,
    		charGapLength,
    		letterGapLength,
    		wordGapLength,
    		updateDotLength,
    		keyDown,
    		keyDownTime,
    		pressed,
    		unpressed,
    		clear,
    		check,
    		decode,
    		encode
    	});

    	$$self.$inject_state = $$props => {
    		if ('props' in $$props) $$invalidate(0, props = $$props.props);
    		if ('morseCode' in $$props) morseCode = $$props.morseCode;
    		if ('dotLength' in $$props) $$invalidate(1, dotLength = $$props.dotLength);
    		if ('dashLength' in $$props) $$invalidate(2, dashLength = $$props.dashLength);
    		if ('charGapLength' in $$props) $$invalidate(3, charGapLength = $$props.charGapLength);
    		if ('letterGapLength' in $$props) $$invalidate(4, letterGapLength = $$props.letterGapLength);
    		if ('wordGapLength' in $$props) $$invalidate(5, wordGapLength = $$props.wordGapLength);
    		if ('keyDownTime' in $$props) keyDownTime = $$props.keyDownTime;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		props,
    		dotLength,
    		dashLength,
    		charGapLength,
    		letterGapLength,
    		wordGapLength,
    		updateDotLength,
    		keyDown,
    		pressed,
    		unpressed,
    		clear,
    		check
    	];
    }

    class MorseDecoder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { props: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MorseDecoder",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get props() {
    		throw new Error("<MorseDecoder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<MorseDecoder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    //12:00 AM/PM
    const formatAMPM = (date) => {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? 'pm' : 'am';

      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;

      return `${hours}:${minutes}${ampm}`
    };

    //Mon DD, YYYY
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const array = date.toDateString().split(' ');
      return `${array[1]} ${array[2]}, ${array[3]}`
    };

    //Color Formats
    const rgbToHex = (rgb) => {
      const rgbRegex = /rgb\((\d+),(\d+),(\d+)\)/;
      const rgbArray = rgb.match(rgbRegex);
      const RGB = (rgbArray[1] << 16) | (rgbArray[2] << 8) | (rgbArray[3] << 0);
      return '#' + (0x1000000 + RGB).toString(16).slice(1)
    };

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgb(${r},${g},${b})`
    };

    /* src\components\Chat\Message.svelte generated by Svelte v3.55.1 */
    const file$e = "src\\components\\Chat\\Message.svelte";

    // (52:0) {:else}
    function create_else_block$4(ctx) {
    	let li;
    	let div;
    	let h3;
    	let t0_value = /*message*/ ctx[1].senderName + "";
    	let t0;
    	let t1;
    	let time;
    	let t2_value = formatAMPM(new Date(/*message*/ ctx[1].timestamp)) + "";
    	let t2;
    	let t3;
    	let p;
    	let t4_value = /*message*/ ctx[1].msg + "";
    	let t4;
    	let li_class_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			time = element("time");
    			t2 = text(t2_value);
    			t3 = space();
    			p = element("p");
    			t4 = text(t4_value);
    			attr_dev(h3, "class", "svelte-l1igjt");
    			add_location(h3, file$e, 54, 6, 1479);
    			attr_dev(time, "class", "svelte-l1igjt");
    			add_location(time, file$e, 55, 6, 1516);
    			attr_dev(div, "class", "header svelte-l1igjt");
    			add_location(div, file$e, 53, 4, 1451);
    			set_style(p, "background-color", /*message*/ ctx[1].color);
    			set_style(p, "color", /*message*/ ctx[1].text);
    			attr_dev(p, "class", "svelte-l1igjt");
    			add_location(p, file$e, 58, 4, 1590);

    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*message*/ ctx[1].senderID === /*currentUserID*/ ctx[0]
    			? 'message you'
    			: 'message') + " svelte-l1igjt"));

    			add_location(li, file$e, 52, 2, 1370);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			append_dev(div, time);
    			append_dev(time, t2);
    			append_dev(li, t3);
    			append_dev(li, p);
    			append_dev(p, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 2 && t0_value !== (t0_value = /*message*/ ctx[1].senderName + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*message*/ 2 && t2_value !== (t2_value = formatAMPM(new Date(/*message*/ ctx[1].timestamp)) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*message*/ 2 && t4_value !== (t4_value = /*message*/ ctx[1].msg + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*message*/ 2) {
    				set_style(p, "background-color", /*message*/ ctx[1].color);
    			}

    			if (dirty & /*message*/ 2) {
    				set_style(p, "color", /*message*/ ctx[1].text);
    			}

    			if (dirty & /*message, currentUserID*/ 3 && li_class_value !== (li_class_value = "" + (null_to_empty(/*message*/ ctx[1].senderID === /*currentUserID*/ ctx[0]
    			? 'message you'
    			: 'message') + " svelte-l1igjt"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(52:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:33) 
    function create_if_block_1$4(ctx) {
    	let li;
    	let div;
    	let h3;
    	let t0_value = /*message*/ ctx[1].senderName + "";
    	let t0;
    	let t1;
    	let time;
    	let t2_value = formatAMPM(new Date(/*message*/ ctx[1].timestamp)) + "";
    	let t2;
    	let t3;
    	let a;
    	let img;
    	let img_class_value;
    	let img_src_value;
    	let img_alt_value;
    	let a_href_value;
    	let li_class_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			time = element("time");
    			t2 = text(t2_value);
    			t3 = space();
    			a = element("a");
    			img = element("img");
    			attr_dev(h3, "class", "svelte-l1igjt");
    			add_location(h3, file$e, 36, 6, 917);
    			attr_dev(time, "class", "svelte-l1igjt");
    			add_location(time, file$e, 37, 6, 954);
    			attr_dev(div, "class", "header svelte-l1igjt");
    			add_location(div, file$e, 35, 4, 889);

    			attr_dev(img, "class", img_class_value = "" + (null_to_empty(/*message*/ ctx[1].senderID === /*currentUserID*/ ctx[0]
    			? 'you'
    			: '') + " svelte-l1igjt"));

    			if (!src_url_equal(img.src, img_src_value = /*message*/ ctx[1].msg)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*message*/ ctx[1].msg);
    			attr_dev(img, "loading", "lazy");
    			add_location(img, file$e, 41, 6, 1148);
    			attr_dev(a, "href", a_href_value = /*message*/ ctx[1].msg);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noreferrer");
    			add_location(a, file$e, 39, 4, 1026);

    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*message*/ ctx[1].senderID === /*currentUserID*/ ctx[0]
    			? 'message you'
    			: 'message') + " svelte-l1igjt"));

    			add_location(li, file$e, 34, 2, 808);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			append_dev(div, time);
    			append_dev(time, t2);
    			append_dev(li, t3);
    			append_dev(li, a);
    			append_dev(a, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 2 && t0_value !== (t0_value = /*message*/ ctx[1].senderName + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*message*/ 2 && t2_value !== (t2_value = formatAMPM(new Date(/*message*/ ctx[1].timestamp)) + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*message, currentUserID*/ 3 && img_class_value !== (img_class_value = "" + (null_to_empty(/*message*/ ctx[1].senderID === /*currentUserID*/ ctx[0]
    			? 'you'
    			: '') + " svelte-l1igjt"))) {
    				attr_dev(img, "class", img_class_value);
    			}

    			if (dirty & /*message*/ 2 && !src_url_equal(img.src, img_src_value = /*message*/ ctx[1].msg)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*message*/ 2 && img_alt_value !== (img_alt_value = /*message*/ ctx[1].msg)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*message*/ 2 && a_href_value !== (a_href_value = /*message*/ ctx[1].msg)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*message, currentUserID*/ 3 && li_class_value !== (li_class_value = "" + (null_to_empty(/*message*/ ctx[1].senderID === /*currentUserID*/ ctx[0]
    			? 'message you'
    			: 'message') + " svelte-l1igjt"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(34:33) ",
    		ctx
    	});

    	return block;
    }

    // (17:0) {#if message.type === 'rgb'}
    function create_if_block$8(ctx) {
    	let li;
    	let div0;
    	let h3;
    	let t0_value = /*message*/ ctx[1].senderName + "";
    	let t0;
    	let t1;
    	let time;
    	let t2_value = formatAMPM(new Date(/*message*/ ctx[1].timestamp)) + "";
    	let t2;
    	let t3;
    	let div2;
    	let h2;
    	let t4_value = /*message*/ ctx[1].msg + "";
    	let t4;
    	let t5;
    	let div1;
    	let li_class_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div0 = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			time = element("time");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			h2 = element("h2");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			attr_dev(h3, "class", "svelte-l1igjt");
    			add_location(h3, file$e, 23, 6, 510);
    			attr_dev(time, "class", "svelte-l1igjt");
    			add_location(time, file$e, 24, 6, 547);
    			attr_dev(div0, "class", "header svelte-l1igjt");
    			add_location(div0, file$e, 22, 4, 482);
    			attr_dev(h2, "class", "svelte-l1igjt");
    			add_location(h2, file$e, 27, 6, 650);
    			set_style(div1, "background-color", /*message*/ ctx[1].msg);
    			attr_dev(div1, "class", "svelte-l1igjt");
    			add_location(div1, file$e, 28, 6, 680);
    			attr_dev(div2, "class", "color-box svelte-l1igjt");
    			add_location(div2, file$e, 26, 4, 619);

    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*message*/ ctx[1].senderID === /*currentUserID*/ ctx[0]
    			? 'message color you'
    			: 'message color') + " svelte-l1igjt"));

    			add_location(li, file$e, 17, 2, 366);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t0);
    			append_dev(div0, t1);
    			append_dev(div0, time);
    			append_dev(time, t2);
    			append_dev(li, t3);
    			append_dev(li, div2);
    			append_dev(div2, h2);
    			append_dev(h2, t4);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 2 && t0_value !== (t0_value = /*message*/ ctx[1].senderName + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*message*/ 2 && t2_value !== (t2_value = formatAMPM(new Date(/*message*/ ctx[1].timestamp)) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*message*/ 2 && t4_value !== (t4_value = /*message*/ ctx[1].msg + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*message*/ 2) {
    				set_style(div1, "background-color", /*message*/ ctx[1].msg);
    			}

    			if (dirty & /*message, currentUserID*/ 3 && li_class_value !== (li_class_value = "" + (null_to_empty(/*message*/ ctx[1].senderID === /*currentUserID*/ ctx[0]
    			? 'message color you'
    			: 'message color') + " svelte-l1igjt"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(17:0) {#if message.type === 'rgb'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*message*/ ctx[1].type === 'rgb') return create_if_block$8;
    		if (/*message*/ ctx[1].type === 'img') return create_if_block_1$4;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Message', slots, []);
    	let { currentUserID = 0 } = $$props;

    	let { message = {
    		senderID: 0,
    		senderName: 'BenGomez',
    		msg: 'Default Msg',
    		color: 'rgb(61, 132, 153)',
    		text: 'white',
    		type: 'text',
    		timestamp: new Date()
    	} } = $$props;

    	const writable_props = ['currentUserID', 'message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Message> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('currentUserID' in $$props) $$invalidate(0, currentUserID = $$props.currentUserID);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({ currentUserID, message, formatAMPM });

    	$$self.$inject_state = $$props => {
    		if ('currentUserID' in $$props) $$invalidate(0, currentUserID = $$props.currentUserID);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentUserID, message];
    }

    class Message extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { currentUserID: 0, message: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Message",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get currentUserID() {
    		throw new Error("<Message>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentUserID(value) {
    		throw new Error("<Message>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<Message>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Message>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.55.1 */

    const file$d = "src\\components\\Footer.svelte";

    function create_fragment$d(ctx) {
    	let footer;
    	let div;
    	let h1;
    	let t1;
    	let a0;
    	let i0;
    	let t2;
    	let t3;
    	let a1;
    	let i1;
    	let t4;
    	let t5;
    	let a2;
    	let i2;
    	let t6;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Contacts";
    			t1 = space();
    			a0 = element("a");
    			i0 = element("i");
    			t2 = text(" contact@bengomez.me");
    			t3 = space();
    			a1 = element("a");
    			i1 = element("i");
    			t4 = text(" GitHub");
    			t5 = space();
    			a2 = element("a");
    			i2 = element("i");
    			t6 = text(" LinkedIn");
    			attr_dev(h1, "class", "svelte-14281mo");
    			add_location(h1, file$d, 6, 4, 50);
    			attr_dev(i0, "class", "fa-solid fa-envelope svelte-14281mo");
    			add_location(i0, file$d, 8, 6, 134);
    			attr_dev(a0, "href", "mailto:contact@bengomez.me");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-14281mo");
    			add_location(a0, file$d, 7, 4, 73);
    			attr_dev(i1, "class", "fa-brands fa-github svelte-14281mo");
    			add_location(i1, file$d, 11, 7, 253);
    			attr_dev(a1, "href", "https://github.com/BenGomez413");
    			attr_dev(a1, "class", "svelte-14281mo");
    			add_location(a1, file$d, 10, 4, 204);
    			attr_dev(i2, "class", "fa-brands fa-linkedin svelte-14281mo");
    			add_location(i2, file$d, 14, 7, 374);
    			attr_dev(a2, "href", "https://www.linkedin.com/in/benjamin-gomez413/");
    			attr_dev(a2, "class", "svelte-14281mo");
    			add_location(a2, file$d, 13, 4, 309);
    			add_location(div, file$d, 5, 2, 39);
    			attr_dev(footer, "class", "svelte-14281mo");
    			add_location(footer, file$d, 4, 0, 27);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, a0);
    			append_dev(a0, i0);
    			append_dev(a0, t2);
    			append_dev(div, t3);
    			append_dev(div, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t4);
    			append_dev(div, t5);
    			append_dev(div, a2);
    			append_dev(a2, i2);
    			append_dev(a2, t6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\components\Home.svelte generated by Svelte v3.55.1 */

    const { console: console_1$9 } = globals;
    const file$c = "src\\components\\Home.svelte";

    function create_fragment$c(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let div12;
    	let div3;
    	let div2;
    	let h20;
    	let t5;
    	let p1;
    	let t7;
    	let morsedecoder;
    	let t8;
    	let div11;
    	let div4;
    	let h21;
    	let t10;
    	let div5;
    	let message0;
    	let t11;
    	let message1;
    	let t12;
    	let div10;
    	let div8;
    	let div6;
    	let t13;
    	let div7;
    	let t14;
    	let div9;
    	let a0;
    	let t16;
    	let div14;
    	let div13;
    	let h22;
    	let t18;
    	let ul;
    	let a1;
    	let li0;
    	let img0;
    	let img0_src_value;
    	let t19;
    	let a2;
    	let li1;
    	let img1;
    	let img1_src_value;
    	let t20;
    	let a3;
    	let li2;
    	let img2;
    	let img2_src_value;
    	let t21;
    	let footer;
    	let current;
    	let mounted;
    	let dispose;
    	morsedecoder = new MorseDecoder({ $$inline: true });

    	message0 = new Message({
    			props: {
    				message: {
    					senderID: 1,
    					senderName: 'BenGomez.me',
    					msg: 'Hello World!',
    					color: 'rgb(61, 132, 153)',
    					text: 'white',
    					timestamp: new Date()
    				}
    			},
    			$$inline: true
    		});

    	message1 = new Message({
    			props: {
    				message: {
    					senderID: 0,
    					senderName: 'You',
    					msg: 'hi!',
    					color: 'rgb(199, 176, 92)',
    					text: 'black',
    					timestamp: new Date()
    				}
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Welcome to my Website!";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "I reserve the right to break it on a whim...";
    			t3 = space();
    			div12 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Morse Decoder";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "fullscreen ⤢";
    			t7 = space();
    			create_component(morsedecoder.$$.fragment);
    			t8 = space();
    			div11 = element("div");
    			div4 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Chat";
    			t10 = space();
    			div5 = element("div");
    			create_component(message0.$$.fragment);
    			t11 = space();
    			create_component(message1.$$.fragment);
    			t12 = space();
    			div10 = element("div");
    			div8 = element("div");
    			div6 = element("div");
    			t13 = space();
    			div7 = element("div");
    			t14 = space();
    			div9 = element("div");
    			a0 = element("a");
    			a0.textContent = "Chat API";
    			t16 = space();
    			div14 = element("div");
    			div13 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Games";
    			t18 = space();
    			ul = element("ul");
    			a1 = element("a");
    			li0 = element("li");
    			img0 = element("img");
    			t19 = space();
    			a2 = element("a");
    			li1 = element("li");
    			img1 = element("img");
    			t20 = space();
    			a3 = element("a");
    			li2 = element("li");
    			img2 = element("img");
    			t21 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(h1, "class", "svelte-4tg2qy");
    			add_location(h1, file$c, 16, 6, 411);
    			attr_dev(p0, "class", "svelte-4tg2qy");
    			add_location(p0, file$c, 17, 6, 450);
    			attr_dev(div0, "class", "center-wrap svelte-4tg2qy");
    			add_location(div0, file$c, 15, 4, 378);
    			attr_dev(div1, "class", "hero svelte-4tg2qy");
    			attr_dev(div1, "id", "hero");
    			add_location(div1, file$c, 14, 2, 344);
    			attr_dev(h20, "class", "svelte-4tg2qy");
    			add_location(h20, file$c, 24, 8, 678);
    			attr_dev(p1, "class", "svelte-4tg2qy");
    			add_location(p1, file$c, 25, 8, 710);
    			attr_dev(div2, "class", "card-header svelte-4tg2qy");
    			add_location(div2, file$c, 23, 6, 643);
    			attr_dev(div3, "class", "morse-decoder card svelte-4tg2qy");
    			attr_dev(div3, "id", "morseDecoder");
    			add_location(div3, file$c, 22, 4, 585);
    			attr_dev(h21, "class", "svelte-4tg2qy");
    			add_location(h21, file$c, 32, 8, 905);
    			attr_dev(div4, "class", "card-header svelte-4tg2qy");
    			add_location(div4, file$c, 31, 6, 870);
    			attr_dev(div5, "class", "preview glass svelte-4tg2qy");
    			add_location(div5, file$c, 35, 6, 942);
    			attr_dev(div6, "class", "triangle svelte-4tg2qy");
    			attr_dev(div6, "id", "triangle-bottomleft");
    			add_location(div6, file$c, 59, 10, 1610);
    			attr_dev(div7, "class", "triangle svelte-4tg2qy");
    			attr_dev(div7, "id", "triangle-bottomright");
    			add_location(div7, file$c, 60, 10, 1671);
    			attr_dev(div8, "class", "inline svelte-4tg2qy");
    			add_location(div8, file$c, 58, 8, 1578);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "svelte-4tg2qy");
    			add_location(a0, file$c, 63, 10, 1782);
    			attr_dev(div9, "class", "link-wrap svelte-4tg2qy");
    			add_location(div9, file$c, 62, 8, 1747);
    			attr_dev(div10, "class", "chin svelte-4tg2qy");
    			add_location(div10, file$c, 57, 6, 1550);
    			attr_dev(div11, "class", "chat card svelte-4tg2qy");
    			attr_dev(div11, "id", "chat");
    			add_location(div11, file$c, 30, 4, 829);
    			attr_dev(div12, "class", "flex-container svelte-4tg2qy");
    			attr_dev(div12, "id", "contentContainer");
    			add_location(div12, file$c, 21, 2, 529);
    			attr_dev(h22, "class", "svelte-4tg2qy");
    			add_location(h22, file$c, 78, 6, 2150);
    			attr_dev(div13, "class", "card-header svelte-4tg2qy");
    			add_location(div13, file$c, 77, 4, 2117);
    			if (!src_url_equal(img0.src, img0_src_value = "../assets/images/AmazingAstroidCartridge.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Amazing Astroids PNG");
    			attr_dev(img0, "class", "svelte-4tg2qy");
    			add_location(img0, file$c, 84, 10, 2289);
    			add_location(li0, file$c, 83, 8, 2273);
    			attr_dev(a1, "href", "/projects/AmazingAsteroids/index.html");
    			attr_dev(a1, "class", "svelte-4tg2qy");
    			add_location(a1, file$c, 82, 6, 2215);
    			if (!src_url_equal(img1.src, img1_src_value = "../assets/images/SafeCrackerCartridge.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Safe Cracker PNG");
    			attr_dev(img1, "class", "svelte-4tg2qy");
    			add_location(img1, file$c, 93, 10, 2517);
    			add_location(li1, file$c, 92, 8, 2501);
    			attr_dev(a2, "href", "/projects/SafeCracker/index.html");
    			attr_dev(a2, "class", "svelte-4tg2qy");
    			add_location(a2, file$c, 91, 6, 2448);
    			if (!src_url_equal(img2.src, img2_src_value = "../assets/images/RockPaperScissorsCartridge.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Rock Paper Scissors PNG");
    			attr_dev(img2, "class", "svelte-4tg2qy");
    			add_location(img2, file$c, 102, 10, 2744);
    			add_location(li2, file$c, 101, 8, 2728);
    			attr_dev(a3, "href", "/projects/RockPaperScissors/index.html");
    			attr_dev(a3, "class", "svelte-4tg2qy");
    			add_location(a3, file$c, 100, 6, 2669);
    			attr_dev(ul, "class", "games-list svelte-4tg2qy");
    			add_location(ul, file$c, 81, 4, 2184);
    			attr_dev(div14, "class", "games svelte-4tg2qy");
    			add_location(div14, file$c, 76, 2, 2092);
    			attr_dev(main, "class", "svelte-4tg2qy");
    			add_location(main, file$c, 13, 0, 334);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(main, t3);
    			append_dev(main, div12);
    			append_dev(div12, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h20);
    			append_dev(div2, t5);
    			append_dev(div2, p1);
    			append_dev(div3, t7);
    			mount_component(morsedecoder, div3, null);
    			append_dev(div12, t8);
    			append_dev(div12, div11);
    			append_dev(div11, div4);
    			append_dev(div4, h21);
    			append_dev(div11, t10);
    			append_dev(div11, div5);
    			mount_component(message0, div5, null);
    			append_dev(div5, t11);
    			mount_component(message1, div5, null);
    			append_dev(div11, t12);
    			append_dev(div11, div10);
    			append_dev(div10, div8);
    			append_dev(div8, div6);
    			append_dev(div8, t13);
    			append_dev(div8, div7);
    			append_dev(div10, t14);
    			append_dev(div10, div9);
    			append_dev(div9, a0);
    			append_dev(main, t16);
    			append_dev(main, div14);
    			append_dev(div14, div13);
    			append_dev(div13, h22);
    			append_dev(div14, t18);
    			append_dev(div14, ul);
    			append_dev(ul, a1);
    			append_dev(a1, li0);
    			append_dev(li0, img0);
    			append_dev(ul, t19);
    			append_dev(ul, a2);
    			append_dev(a2, li1);
    			append_dev(li1, img1);
    			append_dev(ul, t20);
    			append_dev(ul, a3);
    			append_dev(a3, li2);
    			append_dev(li2, img2);
    			append_dev(main, t21);
    			mount_component(footer, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(p1, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(div5, "click", /*click_handler_1*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(morsedecoder.$$.fragment, local);
    			transition_in(message0.$$.fragment, local);
    			transition_in(message1.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(morsedecoder.$$.fragment, local);
    			transition_out(message0.$$.fragment, local);
    			transition_out(message1.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(morsedecoder);
    			destroy_component(message0);
    			destroy_component(message1);
    			destroy_component(footer);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $page;
    	validate_store(page, 'page');
    	component_subscribe($$self, page, $$value => $$invalidate(0, $page = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);

    	const fullscreen = e => {
    		console.log(e.target.dataset.page);
    		set_store_value(page, $page = e.target.dataset.page, $page);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$9.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => set_store_value(page, $page = 'morse', $page);
    	const click_handler_1 = () => set_store_value(page, $page = 'chat', $page);

    	$$self.$capture_state = () => ({
    		MorseDecoder,
    		Message,
    		Footer,
    		page,
    		fullscreen,
    		$page
    	});

    	return [$page, click_handler, click_handler_1];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\components\Profile.svelte generated by Svelte v3.55.1 */

    const { Object: Object_1, console: console_1$8 } = globals;
    const file$b = "src\\components\\Profile.svelte";

    // (176:0) {:else}
    function create_else_block$3(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "User Not Found";
    			t1 = space();
    			input = element("input");
    			add_location(h1, file$b, 177, 4, 4953);
    			attr_dev(input, "type", "button");
    			input.value = "↤ Home";
    			add_location(input, file$b, 178, 4, 4982);
    			add_location(section, file$b, 176, 2, 4938);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "click", /*click_handler_2*/ ctx[5], false, false, false),
    					listen_dev(input, "keydown", null, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(176:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (51:0) {#if $currentUser.createdAt}
    function create_if_block$7(ctx) {
    	let section;
    	let div0;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let form;
    	let div15;
    	let div4;
    	let h20;
    	let t3;
    	let div2;
    	let div1;
    	let t4;
    	let div3;
    	let p0;
    	let t5;
    	let t6_value = formatDate(/*$currentUser*/ ctx[0].createdAt) + "";
    	let t6;
    	let t7;
    	let p1;
    	let t8_value = /*$currentUser*/ ctx[0]._id + "";
    	let t8;
    	let t9;
    	let div8;
    	let svg;
    	let path;
    	let t10;
    	let div7;
    	let div6;
    	let div5;
    	let img;
    	let img_src_value;
    	let t11;
    	let div13;
    	let div11;
    	let div9;
    	let label0;
    	let t13;
    	let input2;
    	let input2_value_value;
    	let t14;
    	let div10;
    	let label1;
    	let t16;
    	let input3;
    	let t17;
    	let label2;
    	let t19;
    	let input4;
    	let input4_value_value;
    	let t20;
    	let label3;
    	let t22;
    	let div12;
    	let input5;
    	let input5_value_value;
    	let t23;
    	let input6;
    	let input6_value_value;
    	let t24;
    	let div14;
    	let h21;
    	let t26;
    	let label4;
    	let t28;
    	let div16;
    	let input7;
    	let t29;
    	let button0;
    	let t31;
    	let div17;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			form = element("form");
    			div15 = element("div");
    			div4 = element("div");
    			h20 = element("h2");
    			h20.textContent = "USER";
    			t3 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t4 = space();
    			div3 = element("div");
    			p0 = element("p");
    			t5 = text("ISSUED: ");
    			t6 = text(t6_value);
    			t7 = space();
    			p1 = element("p");
    			t8 = text(t8_value);
    			t9 = space();
    			div8 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t10 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			img = element("img");
    			t11 = space();
    			div13 = element("div");
    			div11 = element("div");
    			div9 = element("div");
    			label0 = element("label");
    			label0.textContent = "NAME:";
    			t13 = space();
    			input2 = element("input");
    			t14 = space();
    			div10 = element("div");
    			label1 = element("label");
    			label1.textContent = "PASSWORD:";
    			t16 = space();
    			input3 = element("input");
    			t17 = space();
    			label2 = element("label");
    			label2.textContent = "EMAIL:";
    			t19 = space();
    			input4 = element("input");
    			t20 = space();
    			label3 = element("label");
    			label3.textContent = "COLORS:";
    			t22 = space();
    			div12 = element("div");
    			input5 = element("input");
    			t23 = space();
    			input6 = element("input");
    			t24 = space();
    			div14 = element("div");
    			h21 = element("h2");
    			h21.textContent = "BenGomez.ID";
    			t26 = space();
    			label4 = element("label");
    			label4.textContent = "PASSWORD:";
    			t28 = space();
    			div16 = element("div");
    			input7 = element("input");
    			t29 = space();
    			button0 = element("button");
    			button0.textContent = "UPDATE";
    			t31 = space();
    			div17 = element("div");
    			button1 = element("button");
    			button1.textContent = "Delete User";
    			attr_dev(input0, "type", "button");
    			input0.value = "↤ Home";
    			attr_dev(input0, "class", "svelte-104zwzg");
    			add_location(input0, file$b, 53, 6, 1637);
    			attr_dev(input1, "type", "button");
    			input1.value = "Chat ↦";
    			attr_dev(input1, "class", "right svelte-104zwzg");
    			add_location(input1, file$b, 60, 6, 1780);
    			attr_dev(div0, "class", "page-nav svelte-104zwzg");
    			add_location(div0, file$b, 52, 4, 1607);
    			attr_dev(h20, "class", "left svelte-104zwzg");
    			add_location(h20, file$b, 72, 10, 2066);
    			attr_dev(div1, "class", "punch-out svelte-104zwzg");
    			add_location(div1, file$b, 74, 12, 2138);
    			attr_dev(div2, "class", "middle svelte-104zwzg");
    			add_location(div2, file$b, 73, 10, 2104);
    			attr_dev(p0, "class", "issued svelte-104zwzg");
    			add_location(p0, file$b, 77, 12, 2226);
    			attr_dev(p1, "class", "id svelte-104zwzg");
    			add_location(p1, file$b, 81, 12, 2338);
    			attr_dev(div3, "class", "right svelte-104zwzg");
    			add_location(div3, file$b, 76, 10, 2193);
    			attr_dev(div4, "class", "card-top svelte-104zwzg");
    			add_location(div4, file$b, 71, 8, 2032);
    			attr_dev(path, "d", "M0,0 L100,0 L100,20 L0,90z");
    			add_location(path, file$b, 91, 12, 2603);
    			attr_dev(svg, "class", "background svelte-104zwzg");
    			attr_dev(svg, "viewBox", "0 0 100 100");
    			attr_dev(svg, "preserveAspectRatio", "none");
    			add_location(svg, file$b, 86, 10, 2465);
    			attr_dev(img, "class", "profile-pic svelte-104zwzg");
    			if (!src_url_equal(img.src, img_src_value = "../assets/images/LittleGuy.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Little Guy SVG");
    			add_location(img, file$b, 96, 16, 2804);
    			attr_dev(div5, "class", "circle-mask svelte-104zwzg");
    			add_location(div5, file$b, 95, 14, 2761);
    			attr_dev(div6, "class", "pic-border svelte-104zwzg");
    			add_location(div6, file$b, 94, 12, 2721);
    			attr_dev(div7, "class", "profile-pic-container svelte-104zwzg");
    			add_location(div7, file$b, 93, 10, 2672);
    			attr_dev(div8, "class", "profile-pic-section svelte-104zwzg");
    			add_location(div8, file$b, 85, 8, 2420);
    			attr_dev(label0, "for", "username");
    			attr_dev(label0, "class", "svelte-104zwzg");
    			add_location(label0, file$b, 109, 14, 3180);
    			attr_dev(input2, "class", "input svelte-104zwzg");
    			attr_dev(input2, "name", "username");
    			attr_dev(input2, "type", "text");
    			input2.value = input2_value_value = /*$currentUser*/ ctx[0].name;
    			add_location(input2, file$b, 110, 14, 3231);
    			attr_dev(div9, "class", "input-group");
    			add_location(div9, file$b, 108, 12, 3139);
    			attr_dev(label1, "for", "password");
    			attr_dev(label1, "class", "svelte-104zwzg");
    			add_location(label1, file$b, 119, 14, 3468);
    			attr_dev(input3, "class", "input svelte-104zwzg");
    			attr_dev(input3, "id", "newPassword");
    			attr_dev(input3, "name", "password");
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "placeholder", "password...");
    			add_location(input3, file$b, 120, 14, 3523);
    			attr_dev(div10, "class", "input-group");
    			add_location(div10, file$b, 118, 12, 3427);
    			attr_dev(div11, "class", "name-pass-container svelte-104zwzg");
    			add_location(div11, file$b, 107, 10, 3092);
    			attr_dev(label2, "for", "email");
    			attr_dev(label2, "class", "svelte-104zwzg");
    			add_location(label2, file$b, 130, 10, 3773);
    			attr_dev(input4, "class", "input svelte-104zwzg");
    			attr_dev(input4, "name", "email");
    			attr_dev(input4, "type", "email");
    			input4.value = input4_value_value = /*$currentUser*/ ctx[0].email;
    			add_location(input4, file$b, 131, 10, 3818);
    			attr_dev(label3, "for", "color");
    			attr_dev(label3, "class", "svelte-104zwzg");
    			add_location(label3, file$b, 138, 10, 3971);
    			attr_dev(input5, "type", "color");
    			attr_dev(input5, "name", "color");
    			input5.value = input5_value_value = rgbToHex(/*$currentUser*/ ctx[0].color);
    			attr_dev(input5, "class", "svelte-104zwzg");
    			add_location(input5, file$b, 140, 12, 4060);
    			attr_dev(input6, "type", "color");
    			attr_dev(input6, "name", "text");
    			input6.value = input6_value_value = rgbToHex(/*$currentUser*/ ctx[0].text);
    			attr_dev(input6, "class", "svelte-104zwzg");
    			add_location(input6, file$b, 145, 12, 4204);
    			attr_dev(div12, "class", "color-container svelte-104zwzg");
    			add_location(div12, file$b, 139, 10, 4017);
    			attr_dev(div13, "class", "input-container svelte-104zwzg");
    			add_location(div13, file$b, 106, 8, 3051);
    			attr_dev(h21, "class", "svelte-104zwzg");
    			add_location(h21, file$b, 154, 10, 4415);
    			attr_dev(div14, "class", "card-bottom svelte-104zwzg");
    			add_location(div14, file$b, 153, 8, 4378);
    			attr_dev(div15, "class", "profile-card svelte-104zwzg");
    			add_location(div15, file$b, 70, 6, 1996);
    			attr_dev(label4, "class", "update-label svelte-104zwzg");
    			attr_dev(label4, "for", "password");
    			add_location(label4, file$b, 158, 6, 4475);
    			attr_dev(input7, "class", "input svelte-104zwzg");
    			attr_dev(input7, "id", "authPassword");
    			attr_dev(input7, "name", "password");
    			attr_dev(input7, "type", "password");
    			attr_dev(input7, "placeholder", "password...");
    			add_location(input7, file$b, 160, 8, 4583);
    			attr_dev(button0, "class", "svelte-104zwzg");
    			add_location(button0, file$b, 167, 8, 4756);
    			attr_dev(div16, "class", "update-container svelte-104zwzg");
    			add_location(div16, file$b, 159, 6, 4543);
    			add_location(form, file$b, 69, 4, 1956);
    			attr_dev(button1, "class", "deleteUser svelte-104zwzg");
    			add_location(button1, file$b, 172, 6, 4852);
    			attr_dev(div17, "class", "delete-container svelte-104zwzg");
    			add_location(div17, file$b, 171, 4, 4814);
    			attr_dev(section, "class", "profile  svelte-104zwzg");
    			add_location(section, file$b, 51, 2, 1575);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, input0);
    			append_dev(div0, t0);
    			append_dev(div0, input1);
    			append_dev(section, t1);
    			append_dev(section, form);
    			append_dev(form, div15);
    			append_dev(div15, div4);
    			append_dev(div4, h20);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, p0);
    			append_dev(p0, t5);
    			append_dev(p0, t6);
    			append_dev(div3, t7);
    			append_dev(div3, p1);
    			append_dev(p1, t8);
    			append_dev(div15, t9);
    			append_dev(div15, div8);
    			append_dev(div8, svg);
    			append_dev(svg, path);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, img);
    			append_dev(div15, t11);
    			append_dev(div15, div13);
    			append_dev(div13, div11);
    			append_dev(div11, div9);
    			append_dev(div9, label0);
    			append_dev(div9, t13);
    			append_dev(div9, input2);
    			append_dev(div11, t14);
    			append_dev(div11, div10);
    			append_dev(div10, label1);
    			append_dev(div10, t16);
    			append_dev(div10, input3);
    			append_dev(div13, t17);
    			append_dev(div13, label2);
    			append_dev(div13, t19);
    			append_dev(div13, input4);
    			append_dev(div13, t20);
    			append_dev(div13, label3);
    			append_dev(div13, t22);
    			append_dev(div13, div12);
    			append_dev(div12, input5);
    			append_dev(div12, t23);
    			append_dev(div12, input6);
    			append_dev(div15, t24);
    			append_dev(div15, div14);
    			append_dev(div14, h21);
    			append_dev(form, t26);
    			append_dev(form, label4);
    			append_dev(form, t28);
    			append_dev(form, div16);
    			append_dev(div16, input7);
    			append_dev(div16, t29);
    			append_dev(div16, button0);
    			append_dev(section, t31);
    			append_dev(section, div17);
    			append_dev(div17, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(input0, "keydown", null, false, false, false),
    					listen_dev(input1, "click", /*click_handler_1*/ ctx[4], false, false, false),
    					listen_dev(input1, "keydown", null, false, false, false),
    					listen_dev(form, "submit", /*updateProfile*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentUser*/ 1 && t6_value !== (t6_value = formatDate(/*$currentUser*/ ctx[0].createdAt) + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$currentUser*/ 1 && t8_value !== (t8_value = /*$currentUser*/ ctx[0]._id + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*$currentUser*/ 1 && input2_value_value !== (input2_value_value = /*$currentUser*/ ctx[0].name) && input2.value !== input2_value_value) {
    				prop_dev(input2, "value", input2_value_value);
    			}

    			if (dirty & /*$currentUser*/ 1 && input4_value_value !== (input4_value_value = /*$currentUser*/ ctx[0].email) && input4.value !== input4_value_value) {
    				prop_dev(input4, "value", input4_value_value);
    			}

    			if (dirty & /*$currentUser*/ 1 && input5_value_value !== (input5_value_value = rgbToHex(/*$currentUser*/ ctx[0].color))) {
    				prop_dev(input5, "value", input5_value_value);
    			}

    			if (dirty & /*$currentUser*/ 1 && input6_value_value !== (input6_value_value = rgbToHex(/*$currentUser*/ ctx[0].text))) {
    				prop_dev(input6, "value", input6_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(51:0) {#if $currentUser.createdAt}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$currentUser*/ ctx[0].createdAt) return create_if_block$7;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $currentUser;
    	let $socket;
    	let $page;
    	validate_store(currentUser, 'currentUser');
    	component_subscribe($$self, currentUser, $$value => $$invalidate(0, $currentUser = $$value));
    	validate_store(socket, 'socket');
    	component_subscribe($$self, socket, $$value => $$invalidate(6, $socket = $$value));
    	validate_store(page, 'page');
    	component_subscribe($$self, page, $$value => $$invalidate(1, $page = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);

    	const updateProfile = e => {
    		e.preventDefault();

    		//format data
    		let username = e.target.username.value.trim();

    		let email = e.target.email.value.trim();
    		let password = e.target.password.value.trim();
    		let color = hexToRgb(e.target.color.value);
    		let text = hexToRgb(e.target.text.value);

    		//check different
    		if (username === $currentUser.name) username = null;

    		if (email === $currentUser.email) email = null;
    		if (color === $currentUser.color) color = null;
    		if (text === $currentUser.text) text = null;

    		//Only send values that are different and need to be updated
    		const payload = {
    			_id: $currentUser._id,
    			update: {
    				...username && { name: username },
    				...email && { email },
    				...password && { password },
    				...color && { color },
    				...text && { text }
    			}
    		};

    		//nothing different return
    		if (Object.keys(payload).length <= 1) return;

    		$socket.emit('user:update', payload, response => {
    			set_store_value(currentUser, $currentUser = response, $currentUser);
    			localStorage.setItem('currentUser', JSON.stringify(response));
    			console.log('%c ✔ User Updated', 'color:rgb(63, 153, 82); font-weight: bold;');
    		}); // console.dir(response)
    	};

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => set_store_value(page, $page = 'home', $page);
    	const click_handler_1 = () => set_store_value(page, $page = 'chat', $page);
    	const click_handler_2 = () => set_store_value(page, $page = 'home', $page);

    	$$self.$capture_state = () => ({
    		socket,
    		currentUser,
    		rgbToHex,
    		hexToRgb,
    		formatDate,
    		page,
    		updateProfile,
    		$currentUser,
    		$socket,
    		$page
    	});

    	return [
    		$currentUser,
    		$page,
    		updateProfile,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\Login.svelte generated by Svelte v3.55.1 */

    const { console: console_1$7 } = globals;
    const file$a = "src\\components\\Login.svelte";

    // (102:2) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let t;
    	let if_block0 = /*tab*/ ctx[0] === 'login' && create_if_block_2$3(ctx);
    	let if_block1 = /*tab*/ ctx[0] === 'create' && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "container glass  svelte-11cg6qn");
    			add_location(div, file$a, 102, 4, 2704);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*tab*/ ctx[0] === 'login') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*tab*/ ctx[0] === 'create') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$3(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(102:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (100:2) {#if $currentUser._id}
    function create_if_block$6(ctx) {
    	let profile;
    	let current;
    	profile = new Profile({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(profile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(profile, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(profile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(profile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(profile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(100:2) {#if $currentUser._id}",
    		ctx
    	});

    	return block;
    }

    // (104:6) {#if tab === 'login'}
    function create_if_block_2$3(ctx) {
    	let h1;
    	let t1;
    	let form;
    	let div0;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let div1;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let input2;
    	let t8;
    	let div2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Login";
    			t1 = space();
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Email";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Create An Account";
    			attr_dev(h1, "class", "svelte-11cg6qn");
    			add_location(h1, file$a, 104, 8, 2773);
    			attr_dev(label0, "for", "email");
    			attr_dev(label0, "class", "svelte-11cg6qn");
    			add_location(label0, file$a, 107, 12, 2917);
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "name", "email");
    			attr_dev(input0, "id", "email");
    			attr_dev(input0, "placeholder", "email...");
    			input0.required = true;
    			input0.autofocus = true;
    			attr_dev(input0, "class", "svelte-11cg6qn");
    			add_location(input0, file$a, 109, 12, 3014);
    			attr_dev(div0, "class", "input-group svelte-11cg6qn");
    			add_location(div0, file$a, 106, 10, 2878);
    			attr_dev(label1, "for", "password");
    			attr_dev(label1, "class", "svelte-11cg6qn");
    			add_location(label1, file$a, 120, 12, 3276);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "placeholder", "password...");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-11cg6qn");
    			add_location(input1, file$a, 121, 12, 3328);
    			attr_dev(div1, "class", "input-group svelte-11cg6qn");
    			add_location(div1, file$a, 119, 10, 3237);
    			attr_dev(input2, "type", "submit");
    			input2.value = "Login";
    			attr_dev(input2, "class", "svelte-11cg6qn");
    			add_location(input2, file$a, 130, 10, 3538);
    			attr_dev(form, "class", "login  svelte-11cg6qn");
    			attr_dev(form, "id", "login");
    			add_location(form, file$a, 105, 8, 2797);
    			attr_dev(button, "class", "switch-tab-btn svelte-11cg6qn");
    			add_location(button, file$a, 133, 10, 3646);
    			attr_dev(div2, "class", "switch-tab-wrapper svelte-11cg6qn");
    			add_location(div2, file$a, 132, 8, 3602);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			append_dev(form, t4);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			append_dev(form, t7);
    			append_dev(form, input2);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, button);
    			input0.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(form, "submit", prevent_default(/*loginUser*/ ctx[3]), false, true, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(104:6) {#if tab === 'login'}",
    		ctx
    	});

    	return block;
    }

    // (140:6) {#if tab === 'create'}
    function create_if_block_1$3(ctx) {
    	let form;
    	let h1;
    	let t1;
    	let div0;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let div3;
    	let div1;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let div2;
    	let label2;
    	let t9;
    	let input2;
    	let t10;
    	let div4;
    	let label3;
    	let t12;
    	let input3;
    	let t13;
    	let h3;
    	let t15;
    	let div7;
    	let div5;
    	let input4;
    	let t16;
    	let div6;
    	let input5;
    	let t17;
    	let input6;
    	let t18;
    	let div8;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			h1 = element("h1");
    			h1.textContent = "Create";
    			t1 = space();
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Email";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div3 = element("div");
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Confirm";
    			t9 = space();
    			input2 = element("input");
    			t10 = space();
    			div4 = element("div");
    			label3 = element("label");
    			label3.textContent = "Username";
    			t12 = space();
    			input3 = element("input");
    			t13 = space();
    			h3 = element("h3");
    			h3.textContent = "Colors";
    			t15 = space();
    			div7 = element("div");
    			div5 = element("div");
    			input4 = element("input");
    			t16 = space();
    			div6 = element("div");
    			input5 = element("input");
    			t17 = space();
    			input6 = element("input");
    			t18 = space();
    			div8 = element("div");
    			button = element("button");
    			button.textContent = "Back To Login";
    			attr_dev(h1, "class", "svelte-11cg6qn");
    			add_location(h1, file$a, 141, 10, 3915);
    			attr_dev(label0, "for", "email");
    			attr_dev(label0, "class", "svelte-11cg6qn");
    			add_location(label0, file$a, 143, 12, 3981);
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "name", "email");
    			attr_dev(input0, "id", "email");
    			attr_dev(input0, "placeholder", "email...");
    			input0.required = true;
    			input0.autofocus = true;
    			attr_dev(input0, "class", "svelte-11cg6qn");
    			add_location(input0, file$a, 145, 12, 4078);
    			attr_dev(div0, "class", "input-group svelte-11cg6qn");
    			add_location(div0, file$a, 142, 10, 3942);
    			attr_dev(label1, "for", "password1");
    			attr_dev(label1, "class", "svelte-11cg6qn");
    			add_location(label1, file$a, 157, 14, 4374);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password1");
    			attr_dev(input1, "id", "password1");
    			attr_dev(input1, "placeholder", "password...");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-11cg6qn");
    			add_location(input1, file$a, 158, 14, 4429);
    			attr_dev(div1, "class", "input-group svelte-11cg6qn");
    			add_location(div1, file$a, 156, 12, 4333);
    			attr_dev(label2, "for", "password2");
    			attr_dev(label2, "class", "svelte-11cg6qn");
    			add_location(label2, file$a, 167, 14, 4696);
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "name", "password2");
    			attr_dev(input2, "id", "password2");
    			attr_dev(input2, "placeholder", "password...");
    			input2.required = true;
    			attr_dev(input2, "class", "svelte-11cg6qn");
    			add_location(input2, file$a, 168, 14, 4750);
    			attr_dev(div2, "class", "input-group svelte-11cg6qn");
    			add_location(div2, file$a, 166, 12, 4655);
    			attr_dev(div3, "class", "flex svelte-11cg6qn");
    			add_location(div3, file$a, 155, 10, 4301);
    			attr_dev(label3, "for", "username");
    			attr_dev(label3, "class", "svelte-11cg6qn");
    			add_location(label3, file$a, 179, 12, 5033);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "name", "username");
    			attr_dev(input3, "id", "username");
    			attr_dev(input3, "placeholder", "username...");
    			input3.required = true;
    			attr_dev(input3, "class", "svelte-11cg6qn");
    			add_location(input3, file$a, 180, 12, 5085);
    			attr_dev(div4, "class", "input-group svelte-11cg6qn");
    			add_location(div4, file$a, 178, 10, 4994);
    			attr_dev(h3, "class", "svelte-11cg6qn");
    			add_location(h3, file$a, 189, 10, 5291);
    			attr_dev(input4, "type", "color");
    			attr_dev(input4, "class", "color svelte-11cg6qn");
    			attr_dev(input4, "name", "bg-color");
    			attr_dev(input4, "id", "bgColor");
    			input4.value = /*defaults*/ ctx[2].color;
    			add_location(input4, file$a, 192, 14, 5391);
    			attr_dev(div5, "class", "color-group svelte-11cg6qn");
    			add_location(div5, file$a, 191, 12, 5350);
    			attr_dev(input5, "type", "color");
    			attr_dev(input5, "class", "color svelte-11cg6qn");
    			attr_dev(input5, "name", "txt-color");
    			attr_dev(input5, "id", "txtColor");
    			input5.value = /*defaults*/ ctx[2].text;
    			add_location(input5, file$a, 202, 14, 5657);
    			attr_dev(div6, "class", "color-group svelte-11cg6qn");
    			add_location(div6, file$a, 201, 12, 5615);
    			attr_dev(div7, "class", "flex svelte-11cg6qn");
    			add_location(div7, file$a, 190, 10, 5318);
    			attr_dev(input6, "type", "submit");
    			input6.value = "Create";
    			attr_dev(input6, "class", "svelte-11cg6qn");
    			add_location(input6, file$a, 212, 10, 5898);
    			attr_dev(form, "class", "login svelte-11cg6qn");
    			attr_dev(form, "id", "login");
    			add_location(form, file$a, 140, 8, 3834);
    			attr_dev(button, "class", "switch-tab-btn svelte-11cg6qn");
    			add_location(button, file$a, 215, 10, 6007);
    			attr_dev(div8, "class", "switch-tab-wrapper svelte-11cg6qn");
    			add_location(div8, file$a, 214, 8, 5963);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, h1);
    			append_dev(form, t1);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			append_dev(form, t4);
    			append_dev(form, div3);
    			append_dev(div3, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t9);
    			append_dev(div2, input2);
    			append_dev(form, t10);
    			append_dev(form, div4);
    			append_dev(div4, label3);
    			append_dev(div4, t12);
    			append_dev(div4, input3);
    			append_dev(form, t13);
    			append_dev(form, h3);
    			append_dev(form, t15);
    			append_dev(form, div7);
    			append_dev(div7, div5);
    			append_dev(div5, input4);
    			append_dev(div7, t16);
    			append_dev(div7, div6);
    			append_dev(div6, input5);
    			append_dev(form, t17);
    			append_dev(form, input6);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, button);
    			input0.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(form, "submit", prevent_default(/*createUser*/ ctx[4]), false, true, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div8);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(140:6) {#if tab === 'create'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let section;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$currentUser*/ ctx[1]._id) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if_block.c();
    			add_location(section, file$a, 98, 0, 2635);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if_blocks[current_block_type_index].m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(section, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $currentUser;
    	let $socket;
    	validate_store(currentUser, 'currentUser');
    	component_subscribe($$self, currentUser, $$value => $$invalidate(1, $currentUser = $$value));
    	validate_store(socket, 'socket');
    	component_subscribe($$self, socket, $$value => $$invalidate(7, $socket = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);

    	let defaults = {
    		username: 'Username',
    		color: '#3d8499',
    		text: '#ffffff',
    		time: new Date()
    	};

    	let tab = 'login';
    	onMount(() => document.getElementById('email').focus());

    	//FORM SUBMIT FUNCTIONS
    	const loginUser = e => {
    		const payload = {
    			email: e.target.email.value,
    			password: e.target.password.value
    		};

    		$socket.emit('user:login', payload, response => {
    			if (response.code === 200) {
    				set_store_value(currentUser, $currentUser = response.payload, $currentUser);
    				localStorage.setItem('currentUser', JSON.stringify(response.payload));
    				console.log('%c ✔ Login Success', 'color:rgb(63, 153, 82); font-weight: bold;');
    				console.log('%c User Recieved', 'color:rgb(61, 132, 153); font-weight: bold;');
    				console.dir($currentUser);
    			} else {
    				console.log(`%c ✖ Login Failed: ${response.message}`, 'color:rgb(197, 69, 69); font-weight: bold;');
    				console.dir($currentUser);
    			}
    		});
    	};

    	const createUser = e => {
    		const email = e.target.email.value;
    		const password1 = e.target.password1.value;
    		const password2 = e.target.password2.value;
    		const username = e.target.username.value;
    		const color = e.target.bgColor.value;
    		const text = e.target.txtColor.value;

    		if (password1 != password2) {
    			return console.log('Passwords do not match');
    		}

    		if (username.length < 3) {
    			return console.log('Username must be at least 3 characters');
    		}

    		const payload = {
    			email,
    			password: password1,
    			name: username,
    			color: hexToRgb(color),
    			text: hexToRgb(text),
    			icon: 'BROWSER'
    		};

    		$socket.emit('user:create', payload, response => {
    			if (response.code === 201) {
    				set_store_value(currentUser, $currentUser = response.payload, $currentUser);
    				localStorage.setItem('currentUser', JSON.stringify(response.payload));
    				console.log('%c ✔ User Created', 'color:rgb(63, 153, 82); font-weight: bold;');
    				console.dir(response.payload);
    			} else {
    				console.log(`%c ✖ Login Failed: ${response.message}`, 'color:rgb(197, 69, 69); font-weight: bold;');
    			}
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, tab = 'create');
    	const click_handler_1 = () => $$invalidate(0, tab = 'login');

    	$$self.$capture_state = () => ({
    		onMount,
    		Profile,
    		socket,
    		page,
    		currentUser,
    		hexToRgb,
    		defaults,
    		tab,
    		loginUser,
    		createUser,
    		$currentUser,
    		$socket
    	});

    	$$self.$inject_state = $$props => {
    		if ('defaults' in $$props) $$invalidate(2, defaults = $$props.defaults);
    		if ('tab' in $$props) $$invalidate(0, tab = $$props.tab);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		tab,
    		$currentUser,
    		defaults,
    		loginUser,
    		createUser,
    		click_handler,
    		click_handler_1
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const currentChatroom = writable({});

    /* src\components\Chat\UserSidebar.svelte generated by Svelte v3.55.1 */

    const { console: console_1$6 } = globals;
    const file$9 = "src\\components\\Chat\\UserSidebar.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (137:6) {#if $currentUser.ownedChatrooms && $currentUser.ownedChatrooms.length > 0}
    function create_if_block_3$2(ctx) {
    	let each_1_anchor;
    	let each_value_3 = /*$currentUser*/ ctx[1].ownedChatrooms;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentChatroom, $currentUser, joinRoom, setIcon*/ 75) {
    				each_value_3 = /*$currentUser*/ ctx[1].ownedChatrooms;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(137:6) {#if $currentUser.ownedChatrooms && $currentUser.ownedChatrooms.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (138:8) {#each $currentUser.ownedChatrooms as room}
    function create_each_block_3(ctx) {
    	let button;
    	let t0_value = /*room*/ ctx[12].name + "";
    	let t0;
    	let t1;
    	let i;
    	let i_class_value;
    	let t2;
    	let button_class_value;
    	let button_id_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			i = element("i");
    			t2 = space();
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*setIcon*/ ctx[3](/*room*/ ctx[12].ownerIcon)) + " svelte-8kbezj"));
    			add_location(i, file$9, 144, 12, 4156);
    			attr_dev(button, "class", button_class_value = "room " + (/*$currentChatroom*/ ctx[0]._id === /*room*/ ctx[12]._id && 'selected') + " svelte-8kbezj");
    			attr_dev(button, "id", button_id_value = /*room*/ ctx[12]._id);
    			add_location(button, file$9, 138, 10, 3961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, i);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*joinRoom*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentUser*/ 2 && t0_value !== (t0_value = /*room*/ ctx[12].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$currentUser*/ 2 && i_class_value !== (i_class_value = "" + (null_to_empty(/*setIcon*/ ctx[3](/*room*/ ctx[12].ownerIcon)) + " svelte-8kbezj"))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*$currentChatroom, $currentUser*/ 3 && button_class_value !== (button_class_value = "room " + (/*$currentChatroom*/ ctx[0]._id === /*room*/ ctx[12]._id && 'selected') + " svelte-8kbezj")) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*$currentUser*/ 2 && button_id_value !== (button_id_value = /*room*/ ctx[12]._id)) {
    				attr_dev(button, "id", button_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(138:8) {#each $currentUser.ownedChatrooms as room}",
    		ctx
    	});

    	return block;
    }

    // (150:6) {#if $currentUser.joinedChatrooms && $currentUser.joinedChatrooms.length > 0}
    function create_if_block_2$2(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*$currentUser*/ ctx[1].joinedChatrooms;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentChatroom, $currentUser, joinRoom, setIcon*/ 75) {
    				each_value_2 = /*$currentUser*/ ctx[1].joinedChatrooms;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(150:6) {#if $currentUser.joinedChatrooms && $currentUser.joinedChatrooms.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (151:8) {#each $currentUser.joinedChatrooms as room}
    function create_each_block_2(ctx) {
    	let button;
    	let t0_value = /*room*/ ctx[12].name + "";
    	let t0;
    	let t1;
    	let i;
    	let i_class_value;
    	let t2;
    	let button_class_value;
    	let button_id_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			i = element("i");
    			t2 = space();
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*setIcon*/ ctx[3](/*room*/ ctx[12].ownerIcon)) + " svelte-8kbezj"));
    			add_location(i, file$9, 157, 12, 4592);
    			attr_dev(button, "class", button_class_value = "room " + (/*$currentChatroom*/ ctx[0]._id === /*room*/ ctx[12]._id && 'selected') + " svelte-8kbezj");
    			attr_dev(button, "id", button_id_value = /*room*/ ctx[12]._id);
    			add_location(button, file$9, 151, 10, 4397);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, i);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*joinRoom*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentUser*/ 2 && t0_value !== (t0_value = /*room*/ ctx[12].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$currentUser*/ 2 && i_class_value !== (i_class_value = "" + (null_to_empty(/*setIcon*/ ctx[3](/*room*/ ctx[12].ownerIcon)) + " svelte-8kbezj"))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*$currentChatroom, $currentUser*/ 3 && button_class_value !== (button_class_value = "room " + (/*$currentChatroom*/ ctx[0]._id === /*room*/ ctx[12]._id && 'selected') + " svelte-8kbezj")) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*$currentUser*/ 2 && button_id_value !== (button_id_value = /*room*/ ctx[12]._id)) {
    				attr_dev(button, "id", button_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(151:8) {#each $currentUser.joinedChatrooms as room}",
    		ctx
    	});

    	return block;
    }

    // (199:6) {#if $currentUser.ownedChatrooms && $currentUser.ownedChatrooms.length > 0}
    function create_if_block_1$2(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*$currentUser*/ ctx[1].ownedChatrooms;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentChatroom, $currentUser, joinRoom, setIcon*/ 75) {
    				each_value_1 = /*$currentUser*/ ctx[1].ownedChatrooms;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(199:6) {#if $currentUser.ownedChatrooms && $currentUser.ownedChatrooms.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (200:8) {#each $currentUser.ownedChatrooms as room}
    function create_each_block_1$1(ctx) {
    	let button;
    	let t0_value = /*room*/ ctx[12].name + "";
    	let t0;
    	let t1;
    	let i;
    	let i_class_value;
    	let t2;
    	let button_class_value;
    	let button_id_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			i = element("i");
    			t2 = space();
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*setIcon*/ ctx[3](/*room*/ ctx[12].ownerIcon)) + " svelte-8kbezj"));
    			add_location(i, file$9, 206, 12, 6031);
    			attr_dev(button, "class", button_class_value = "room " + (/*$currentChatroom*/ ctx[0]._id === /*room*/ ctx[12]._id && 'selected') + " svelte-8kbezj");
    			attr_dev(button, "id", button_id_value = /*room*/ ctx[12]._id);
    			add_location(button, file$9, 200, 10, 5836);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, i);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*joinRoom*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentUser*/ 2 && t0_value !== (t0_value = /*room*/ ctx[12].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$currentUser*/ 2 && i_class_value !== (i_class_value = "" + (null_to_empty(/*setIcon*/ ctx[3](/*room*/ ctx[12].ownerIcon)) + " svelte-8kbezj"))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*$currentChatroom, $currentUser*/ 3 && button_class_value !== (button_class_value = "room " + (/*$currentChatroom*/ ctx[0]._id === /*room*/ ctx[12]._id && 'selected') + " svelte-8kbezj")) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*$currentUser*/ 2 && button_id_value !== (button_id_value = /*room*/ ctx[12]._id)) {
    				attr_dev(button, "id", button_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(200:8) {#each $currentUser.ownedChatrooms as room}",
    		ctx
    	});

    	return block;
    }

    // (212:6) {#if $currentUser.joinedChatrooms && $currentUser.joinedChatrooms.length > 0}
    function create_if_block$5(ctx) {
    	let each_1_anchor;
    	let each_value = /*$currentUser*/ ctx[1].joinedChatrooms;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentChatroom, $currentUser, joinRoom, setIcon*/ 75) {
    				each_value = /*$currentUser*/ ctx[1].joinedChatrooms;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(212:6) {#if $currentUser.joinedChatrooms && $currentUser.joinedChatrooms.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (213:8) {#each $currentUser.joinedChatrooms as room}
    function create_each_block$2(ctx) {
    	let button;
    	let t0_value = /*room*/ ctx[12].name + "";
    	let t0;
    	let t1;
    	let i;
    	let i_class_value;
    	let t2;
    	let button_class_value;
    	let button_id_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			i = element("i");
    			t2 = space();
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*setIcon*/ ctx[3](/*room*/ ctx[12].ownerIcon)) + " svelte-8kbezj"));
    			add_location(i, file$9, 219, 12, 6467);
    			attr_dev(button, "class", button_class_value = "room " + (/*$currentChatroom*/ ctx[0]._id === /*room*/ ctx[12]._id && 'selected') + " svelte-8kbezj");
    			attr_dev(button, "id", button_id_value = /*room*/ ctx[12]._id);
    			add_location(button, file$9, 213, 10, 6272);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, i);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*joinRoom*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentUser*/ 2 && t0_value !== (t0_value = /*room*/ ctx[12].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$currentUser*/ 2 && i_class_value !== (i_class_value = "" + (null_to_empty(/*setIcon*/ ctx[3](/*room*/ ctx[12].ownerIcon)) + " svelte-8kbezj"))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*$currentChatroom, $currentUser*/ 3 && button_class_value !== (button_class_value = "room " + (/*$currentChatroom*/ ctx[0]._id === /*room*/ ctx[12]._id && 'selected') + " svelte-8kbezj")) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*$currentUser*/ 2 && button_id_value !== (button_id_value = /*room*/ ctx[12]._id)) {
    				attr_dev(button, "id", button_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(213:8) {#each $currentUser.joinedChatrooms as room}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let h20;
    	let t0_value = /*$currentUser*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let span;
    	let t3;
    	let div0;
    	let form0;
    	let input0;
    	let t4;
    	let button0;
    	let t6;
    	let ul0;
    	let button1;
    	let t7;
    	let i0;
    	let button1_class_value;
    	let t8;
    	let t9;
    	let t10;
    	let div3;
    	let h21;
    	let t11_value = /*$currentUser*/ ctx[1].name + "";
    	let t11;
    	let t12;
    	let button2;
    	let i1;
    	let t13;
    	let t14;
    	let button3;
    	let i2;
    	let t15;
    	let div2;
    	let form1;
    	let input1;
    	let t16;
    	let button4;
    	let t18;
    	let ul1;
    	let button5;
    	let t19;
    	let i3;
    	let button5_class_value;
    	let t20;
    	let t21;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$currentUser*/ ctx[1].ownedChatrooms && /*$currentUser*/ ctx[1].ownedChatrooms.length > 0 && create_if_block_3$2(ctx);
    	let if_block1 = /*$currentUser*/ ctx[1].joinedChatrooms && /*$currentUser*/ ctx[1].joinedChatrooms.length > 0 && create_if_block_2$2(ctx);
    	let if_block2 = /*$currentUser*/ ctx[1].ownedChatrooms && /*$currentUser*/ ctx[1].ownedChatrooms.length > 0 && create_if_block_1$2(ctx);
    	let if_block3 = /*$currentUser*/ ctx[1].joinedChatrooms && /*$currentUser*/ ctx[1].joinedChatrooms.length > 0 && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h20 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			span.textContent = "⟳";
    			t3 = space();
    			div0 = element("div");
    			form0 = element("form");
    			input0 = element("input");
    			t4 = space();
    			button0 = element("button");
    			button0.textContent = "+";
    			t6 = space();
    			ul0 = element("ul");
    			button1 = element("button");
    			t7 = text("GLOBAL\r\n        ");
    			i0 = element("i");
    			t8 = space();
    			if (if_block0) if_block0.c();
    			t9 = space();
    			if (if_block1) if_block1.c();
    			t10 = space();
    			div3 = element("div");
    			h21 = element("h2");
    			t11 = text(t11_value);
    			t12 = space();
    			button2 = element("button");
    			i1 = element("i");
    			t13 = text(" Room List");
    			t14 = space();
    			button3 = element("button");
    			i2 = element("i");
    			t15 = space();
    			div2 = element("div");
    			form1 = element("form");
    			input1 = element("input");
    			t16 = space();
    			button4 = element("button");
    			button4.textContent = "+";
    			t18 = space();
    			ul1 = element("ul");
    			button5 = element("button");
    			t19 = text("GLOBAL\r\n        ");
    			i3 = element("i");
    			t20 = space();
    			if (if_block2) if_block2.c();
    			t21 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(span, "class", "svelte-8kbezj");
    			add_location(span, file$9, 116, 4, 3258);
    			set_style(h20, "background-color", /*$currentUser*/ ctx[1].color);
    			set_style(h20, "color", /*$currentUser*/ ctx[1].text);
    			attr_dev(h20, "class", "svelte-8kbezj");
    			add_location(h20, file$9, 110, 2, 3070);
    			attr_dev(input0, "name", "newRoom");
    			attr_dev(input0, "type", "text");
    			input0.required = true;
    			attr_dev(input0, "placeholder", "Create Room...");
    			attr_dev(input0, "class", "svelte-8kbezj");
    			add_location(input0, file$9, 122, 6, 3436);
    			attr_dev(button0, "class", "add-room-btn svelte-8kbezj");
    			add_location(button0, file$9, 123, 6, 3518);
    			attr_dev(form0, "class", "add-room svelte-8kbezj");
    			add_location(form0, file$9, 121, 4, 3382);
    			attr_dev(i0, "class", "fa-solid fa-earth-americas svelte-8kbezj");
    			add_location(i0, file$9, 133, 8, 3754);
    			attr_dev(button1, "id", "GLOBAL");
    			attr_dev(button1, "class", button1_class_value = "room " + (/*$currentChatroom*/ ctx[0]._id === 'GLOBAL' && 'selected') + " svelte-8kbezj");
    			add_location(button1, file$9, 127, 6, 3590);
    			attr_dev(ul0, "class", "svelte-8kbezj");
    			add_location(ul0, file$9, 126, 4, 3578);
    			attr_dev(div0, "class", "room-list svelte-8kbezj");
    			add_location(div0, file$9, 120, 2, 3353);
    			attr_dev(div1, "class", "user-side svelte-8kbezj");
    			add_location(div1, file$9, 108, 0, 3018);
    			set_style(h21, "background-color", /*$currentUser*/ ctx[1].color);
    			set_style(h21, "color", /*$currentUser*/ ctx[1].text);
    			attr_dev(h21, "class", "svelte-8kbezj");
    			add_location(h21, file$9, 168, 2, 4781);
    			attr_dev(i1, "class", "fa-solid fa-bars");
    			add_location(i1, file$9, 176, 5, 5038);
    			attr_dev(button2, "class", "dropdown-btn svelte-8kbezj");
    			add_location(button2, file$9, 175, 2, 4977);
    			attr_dev(i2, "class", "fa-solid fa-rotate-right");
    			add_location(i2, file$9, 179, 5, 5148);
    			attr_dev(button3, "class", "refresh-btn svelte-8kbezj");
    			add_location(button3, file$9, 178, 2, 5095);
    			attr_dev(input1, "name", "newRoom");
    			attr_dev(input1, "type", "text");
    			input1.required = true;
    			attr_dev(input1, "placeholder", "Create Room...");
    			attr_dev(input1, "class", "svelte-8kbezj");
    			add_location(input1, file$9, 184, 6, 5311);
    			attr_dev(button4, "class", "add-room-btn svelte-8kbezj");
    			add_location(button4, file$9, 185, 6, 5393);
    			attr_dev(form1, "class", "add-room svelte-8kbezj");
    			add_location(form1, file$9, 183, 4, 5257);
    			attr_dev(i3, "class", "fa-solid fa-earth-americas svelte-8kbezj");
    			add_location(i3, file$9, 195, 8, 5629);
    			attr_dev(button5, "id", "GLOBAL");
    			attr_dev(button5, "class", button5_class_value = "room " + (/*$currentChatroom*/ ctx[0]._id === 'GLOBAL' && 'selected') + " svelte-8kbezj");
    			add_location(button5, file$9, 189, 6, 5465);
    			attr_dev(ul1, "class", "svelte-8kbezj");
    			add_location(ul1, file$9, 188, 4, 5453);
    			attr_dev(div2, "class", "room-list-dropdown svelte-8kbezj");
    			attr_dev(div2, "id", "dropdown");
    			add_location(div2, file$9, 182, 2, 5205);
    			attr_dev(div3, "class", "user-top svelte-8kbezj");
    			add_location(div3, file$9, 166, 0, 4730);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h20);
    			append_dev(h20, t0);
    			append_dev(h20, t1);
    			append_dev(h20, span);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, form0);
    			append_dev(form0, input0);
    			append_dev(form0, t4);
    			append_dev(form0, button0);
    			append_dev(div0, t6);
    			append_dev(div0, ul0);
    			append_dev(ul0, button1);
    			append_dev(button1, t7);
    			append_dev(button1, i0);
    			append_dev(ul0, t8);
    			if (if_block0) if_block0.m(ul0, null);
    			append_dev(ul0, t9);
    			if (if_block1) if_block1.m(ul0, null);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, h21);
    			append_dev(h21, t11);
    			append_dev(div3, t12);
    			append_dev(div3, button2);
    			append_dev(button2, i1);
    			append_dev(button2, t13);
    			append_dev(div3, t14);
    			append_dev(div3, button3);
    			append_dev(button3, i2);
    			append_dev(div3, t15);
    			append_dev(div3, div2);
    			append_dev(div2, form1);
    			append_dev(form1, input1);
    			append_dev(form1, t16);
    			append_dev(form1, button4);
    			append_dev(div2, t18);
    			append_dev(div2, ul1);
    			append_dev(ul1, button5);
    			append_dev(button5, t19);
    			append_dev(button5, i3);
    			append_dev(ul1, t20);
    			if (if_block2) if_block2.m(ul1, null);
    			append_dev(ul1, t21);
    			if (if_block3) if_block3.m(ul1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", /*refresh*/ ctx[4], false, false, false),
    					listen_dev(span, "keydown", null, false, false, false),
    					listen_dev(h20, "click", self$1(/*click_handler*/ ctx[8]), false, false, false),
    					listen_dev(h20, "keydown", null, false, false, false),
    					listen_dev(form0, "submit", /*createRoom*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*joinRoom*/ ctx[6], false, false, false),
    					listen_dev(h21, "click", self$1(/*click_handler_1*/ ctx[9]), false, false, false),
    					listen_dev(h21, "keydown", null, false, false, false),
    					listen_dev(button2, "click", /*toggleDropdown*/ ctx[7], false, false, false),
    					listen_dev(button3, "click", /*refresh*/ ctx[4], false, false, false),
    					listen_dev(form1, "submit", /*createRoom*/ ctx[5], false, false, false),
    					listen_dev(button5, "click", /*joinRoom*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$currentUser*/ 2 && t0_value !== (t0_value = /*$currentUser*/ ctx[1].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$currentUser*/ 2) {
    				set_style(h20, "background-color", /*$currentUser*/ ctx[1].color);
    			}

    			if (dirty & /*$currentUser*/ 2) {
    				set_style(h20, "color", /*$currentUser*/ ctx[1].text);
    			}

    			if (dirty & /*$currentChatroom*/ 1 && button1_class_value !== (button1_class_value = "room " + (/*$currentChatroom*/ ctx[0]._id === 'GLOBAL' && 'selected') + " svelte-8kbezj")) {
    				attr_dev(button1, "class", button1_class_value);
    			}

    			if (/*$currentUser*/ ctx[1].ownedChatrooms && /*$currentUser*/ ctx[1].ownedChatrooms.length > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$2(ctx);
    					if_block0.c();
    					if_block0.m(ul0, t9);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$currentUser*/ ctx[1].joinedChatrooms && /*$currentUser*/ ctx[1].joinedChatrooms.length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$2(ctx);
    					if_block1.c();
    					if_block1.m(ul0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*$currentUser*/ 2 && t11_value !== (t11_value = /*$currentUser*/ ctx[1].name + "")) set_data_dev(t11, t11_value);

    			if (dirty & /*$currentUser*/ 2) {
    				set_style(h21, "background-color", /*$currentUser*/ ctx[1].color);
    			}

    			if (dirty & /*$currentUser*/ 2) {
    				set_style(h21, "color", /*$currentUser*/ ctx[1].text);
    			}

    			if (dirty & /*$currentChatroom*/ 1 && button5_class_value !== (button5_class_value = "room " + (/*$currentChatroom*/ ctx[0]._id === 'GLOBAL' && 'selected') + " svelte-8kbezj")) {
    				attr_dev(button5, "class", button5_class_value);
    			}

    			if (/*$currentUser*/ ctx[1].ownedChatrooms && /*$currentUser*/ ctx[1].ownedChatrooms.length > 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$2(ctx);
    					if_block2.c();
    					if_block2.m(ul1, t21);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*$currentUser*/ ctx[1].joinedChatrooms && /*$currentUser*/ ctx[1].joinedChatrooms.length > 0) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$5(ctx);
    					if_block3.c();
    					if_block3.m(ul1, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div3);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $currentChatroom;
    	let $loading;
    	let $socket;
    	let $currentUser;
    	let $page;
    	validate_store(currentChatroom, 'currentChatroom');
    	component_subscribe($$self, currentChatroom, $$value => $$invalidate(0, $currentChatroom = $$value));
    	validate_store(loading, 'loading');
    	component_subscribe($$self, loading, $$value => $$invalidate(10, $loading = $$value));
    	validate_store(socket, 'socket');
    	component_subscribe($$self, socket, $$value => $$invalidate(11, $socket = $$value));
    	validate_store(currentUser, 'currentUser');
    	component_subscribe($$self, currentUser, $$value => $$invalidate(1, $currentUser = $$value));
    	validate_store(page, 'page');
    	component_subscribe($$self, page, $$value => $$invalidate(2, $page = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserSidebar', slots, []);

    	const setIcon = icon => {
    		let className;

    		switch (icon) {
    			case 'BROWSER':
    				className = 'fas fa-user';
    				break;
    			case 'ARDUINO':
    				className = 'fas fa-microchip';
    				break;
    			case 'RASPBERRY':
    				className = 'fab fa-raspberry-pi';
    				break;
    			default:
    				className = 'fas fa-question-circle';
    				break;
    		}

    		return className;
    	};

    	//Refresh Room
    	const refresh = () => {
    		//Read User
    		$socket.emit('user:read', { _id: $currentUser._id }, response => {
    			set_store_value(currentUser, $currentUser = response, $currentUser);
    			localStorage.setItem('currentUser', JSON.stringify(response));
    			console.log('%c User Recieved', 'color:rgb(61, 132, 153); font-weight: bold;');
    			console.dir(response);
    		});

    		//Read Chatroom
    		$socket.emit('chatroom:read', { _id: $currentChatroom._id }, response => {
    			set_store_value(currentChatroom, $currentChatroom = response, $currentChatroom);
    			console.log('%c Room Recieved', 'color:rgb(186, 104, 69);font-weight: bold;');
    			console.dir(response);
    		});
    	};

    	//Create Room
    	const createRoom = async e => {
    		e.preventDefault();

    		let newChatroom = {
    			name: e.target.newRoom.value,
    			ownerID: $currentUser._id,
    			ownerName: $currentUser.name,
    			ownerIcon: 'BROWSER',
    			unique: `${$currentUser._id}:${e.target.newRoom.value}`,
    			members: [$currentUser._id],
    			messages: [
    				{
    					senderID: $currentUser._id,
    					senderName: $currentUser.name,
    					color: $currentUser.color,
    					text: $currentUser.text,
    					msg: `${$currentUser.name} created the Room: ${e.target.newRoom.value}`,
    					timestamp: Date.now()
    				}
    			]
    		};

    		// console.log(newChatroom)
    		$socket.emit('chatroom:create', newChatroom, response => {
    			set_store_value(currentUser, $currentUser = response.user, $currentUser);
    			set_store_value(currentChatroom, $currentChatroom = response.chatroom, $currentChatroom);
    		});

    		e.target.newRoom.value = '';
    	};

    	//Join Room
    	const joinRoom = e => {
    		if (e.target.id != null) {
    			set_store_value(loading, $loading = true, $loading);

    			$socket.emit('chatroom:read', { _id: e.target.id }, response => {
    				set_store_value(loading, $loading = false, $loading);
    				set_store_value(currentChatroom, $currentChatroom = response, $currentChatroom);
    				document.getElementById('dropdown').style.display = 'none';
    				console.log('%c Room Recieved', 'color:rgb(186, 104, 69);font-weight: bold;');
    				console.dir(response);
    			});
    		}
    	};

    	joinRoom({ target: { id: 'GLOBAL' } });

    	const toggleDropdown = () => {
    		const dropdown = document.getElementById('dropdown');

    		getComputedStyle(dropdown).display === 'none'
    		? dropdown.style.display = 'block'
    		: dropdown.style.display = 'none';
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<UserSidebar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => set_store_value(page, $page = 'profile', $page);
    	const click_handler_1 = () => set_store_value(page, $page = 'profile', $page);

    	$$self.$capture_state = () => ({
    		loading,
    		socket,
    		page,
    		currentUser,
    		currentChatroom,
    		setIcon,
    		refresh,
    		createRoom,
    		joinRoom,
    		toggleDropdown,
    		$currentChatroom,
    		$loading,
    		$socket,
    		$currentUser,
    		$page
    	});

    	return [
    		$currentChatroom,
    		$currentUser,
    		$page,
    		setIcon,
    		refresh,
    		createRoom,
    		joinRoom,
    		toggleDropdown,
    		click_handler,
    		click_handler_1
    	];
    }

    class UserSidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserSidebar",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\Loading.svelte generated by Svelte v3.55.1 */

    const file$8 = "src\\components\\Loading.svelte";

    // (5:0) {#if status}
    function create_if_block$4(ctx) {
    	let div;
    	let i;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			attr_dev(i, "class", "fa-solid fa-spinner spin svelte-1sqxwh2");
    			add_location(i, file$8, 6, 4, 89);
    			attr_dev(div, "class", "container svelte-1sqxwh2");
    			add_location(div, file$8, 5, 2, 60);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(5:0) {#if status}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let if_block = /*status*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*status*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, []);
    	let { status } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (status === undefined && !('status' in $$props || $$self.$$.bound[$$self.$$.props['status']])) {
    			console.warn("<Loading> was created without expected prop 'status'");
    		}
    	});

    	const writable_props = ['status'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('status' in $$props) $$invalidate(0, status = $$props.status);
    	};

    	$$self.$capture_state = () => ({ status });

    	$$self.$inject_state = $$props => {
    		if ('status' in $$props) $$invalidate(0, status = $$props.status);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [status];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { status: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get status() {
    		throw new Error("<Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\DeleteButton.svelte generated by Svelte v3.55.1 */

    const { console: console_1$5 } = globals;
    const file$7 = "src\\components\\DeleteButton.svelte";

    function create_fragment$7(ctx) {
    	let section;
    	let span;
    	let t0;
    	let t1;
    	let button;
    	let t2;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			span = element("span");
    			t0 = text(/*label*/ ctx[0]);
    			t1 = space();
    			button = element("button");
    			t2 = text("Are You Sure?\r\n    ");
    			i = element("i");
    			attr_dev(span, "id", "span");
    			attr_dev(span, "class", "svelte-1hen5qx");
    			add_location(span, file$7, 23, 2, 556);
    			attr_dev(i, "class", "fa-solid fa-trash svelte-1hen5qx");
    			add_location(i, file$7, 27, 4, 691);
    			attr_dev(button, "id", "btn");
    			attr_dev(button, "class", "svelte-1hen5qx");
    			add_location(button, file$7, 25, 2, 610);
    			attr_dev(section, "class", "svelte-1hen5qx");
    			add_location(section, file$7, 22, 0, 543);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, span);
    			append_dev(span, t0);
    			append_dev(section, t1);
    			append_dev(section, button);
    			append_dev(button, t2);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", /*reveal*/ ctx[2], false, false, false),
    					listen_dev(button, "mouseleave", /*hide*/ ctx[3], false, false, false),
    					listen_dev(
    						button,
    						"click",
    						function () {
    							if (is_function(/*action*/ ctx[1])) /*action*/ ctx[1].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*label*/ 1) set_data_dev(t0, /*label*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DeleteButton', slots, []);
    	let { label = 'Delete' } = $$props;

    	let { action = () => {
    		console.log('Default Delete Component Function Called');
    	} } = $$props;

    	const reveal = () => {
    		const btn = document.getElementById('btn');
    		btn.style.display = 'flex';
    		const span = document.getElementById('span');
    		span.style.display = 'none';
    	};

    	const hide = () => {
    		const btn = document.getElementById('btn');
    		btn.style.display = 'none';
    		const span = document.getElementById('span');
    		span.style.display = 'flex';
    	};

    	const writable_props = ['label', 'action'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<DeleteButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('action' in $$props) $$invalidate(1, action = $$props.action);
    	};

    	$$self.$capture_state = () => ({ label, action, reveal, hide });

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('action' in $$props) $$invalidate(1, action = $$props.action);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, action, reveal, hide];
    }

    class DeleteButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { label: 0, action: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DeleteButton",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get label() {
    		throw new Error("<DeleteButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<DeleteButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get action() {
    		throw new Error("<DeleteButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<DeleteButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Chat\RGB.svelte generated by Svelte v3.55.1 */

    const { console: console_1$4 } = globals;
    const file$6 = "src\\components\\Chat\\RGB.svelte";

    function create_fragment$6(ctx) {
    	let section;
    	let div3;
    	let div0;
    	let header0;
    	let h20;
    	let t1;
    	let span0;
    	let t2;
    	let t3;
    	let input0;
    	let t4;
    	let div1;
    	let header1;
    	let h21;
    	let t6;
    	let span1;
    	let t7;
    	let t8;
    	let input1;
    	let t9;
    	let div2;
    	let header2;
    	let h22;
    	let t11;
    	let span2;
    	let t12;
    	let t13;
    	let input2;
    	let t14;
    	let form;
    	let input3;
    	let t15;
    	let input4;
    	let t16;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div3 = element("div");
    			div0 = element("div");
    			header0 = element("header");
    			h20 = element("h2");
    			h20.textContent = "Red";
    			t1 = space();
    			span0 = element("span");
    			t2 = text(/*r*/ ctx[0]);
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			header1 = element("header");
    			h21 = element("h2");
    			h21.textContent = "Green";
    			t6 = space();
    			span1 = element("span");
    			t7 = text(/*g*/ ctx[1]);
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			div2 = element("div");
    			header2 = element("header");
    			h22 = element("h2");
    			h22.textContent = "Blue";
    			t11 = space();
    			span2 = element("span");
    			t12 = text(/*b*/ ctx[2]);
    			t13 = space();
    			input2 = element("input");
    			t14 = space();
    			form = element("form");
    			input3 = element("input");
    			t15 = space();
    			input4 = element("input");
    			t16 = space();
    			button = element("button");
    			button.textContent = "Send";
    			attr_dev(h20, "class", "svelte-1iik662");
    			add_location(h20, file$6, 62, 8, 1535);
    			attr_dev(span0, "class", "svelte-1iik662");
    			add_location(span0, file$6, 63, 8, 1557);
    			attr_dev(header0, "class", "svelte-1iik662");
    			add_location(header0, file$6, 61, 6, 1517);
    			attr_dev(input0, "type", "range");
    			attr_dev(input0, "class", "red svelte-1iik662");
    			attr_dev(input0, "min", "0");
    			attr_dev(input0, "max", "255");
    			add_location(input0, file$6, 65, 6, 1598);
    			attr_dev(div0, "class", "color svelte-1iik662");
    			add_location(div0, file$6, 60, 4, 1490);
    			attr_dev(h21, "class", "svelte-1iik662");
    			add_location(h21, file$6, 77, 8, 1811);
    			attr_dev(span1, "class", "svelte-1iik662");
    			add_location(span1, file$6, 78, 8, 1835);
    			attr_dev(header1, "class", "svelte-1iik662");
    			add_location(header1, file$6, 76, 6, 1793);
    			attr_dev(input1, "type", "range");
    			attr_dev(input1, "class", "green svelte-1iik662");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", "255");
    			add_location(input1, file$6, 80, 6, 1876);
    			attr_dev(div1, "class", "color svelte-1iik662");
    			add_location(div1, file$6, 75, 4, 1766);
    			attr_dev(h22, "class", "svelte-1iik662");
    			add_location(h22, file$6, 92, 8, 2091);
    			attr_dev(span2, "class", "svelte-1iik662");
    			add_location(span2, file$6, 93, 8, 2114);
    			attr_dev(header2, "class", "svelte-1iik662");
    			add_location(header2, file$6, 91, 6, 2073);
    			attr_dev(input2, "type", "range");
    			attr_dev(input2, "class", "blue svelte-1iik662");
    			attr_dev(input2, "min", "0");
    			attr_dev(input2, "max", "255");
    			add_location(input2, file$6, 95, 6, 2155);
    			attr_dev(div2, "class", "color svelte-1iik662");
    			add_location(div2, file$6, 90, 4, 2046);
    			attr_dev(div3, "class", "rgb svelte-1iik662");
    			add_location(div3, file$6, 59, 2, 1467);
    			attr_dev(input3, "type", "color");
    			attr_dev(input3, "class", "svelte-1iik662");
    			add_location(input3, file$6, 107, 4, 2381);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "id", "message");
    			attr_dev(input4, "class", "svelte-1iik662");
    			add_location(input4, file$6, 108, 4, 2446);
    			attr_dev(button, "class", "svelte-1iik662");
    			add_location(button, file$6, 109, 4, 2503);
    			attr_dev(form, "class", "send svelte-1iik662");
    			add_location(form, file$6, 106, 2, 2332);
    			attr_dev(section, "class", "svelte-1iik662");
    			add_location(section, file$6, 58, 0, 1454);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div3);
    			append_dev(div3, div0);
    			append_dev(div0, header0);
    			append_dev(header0, h20);
    			append_dev(header0, t1);
    			append_dev(header0, span0);
    			append_dev(span0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			set_input_value(input0, /*r*/ ctx[0]);
    			append_dev(div3, t4);
    			append_dev(div3, div1);
    			append_dev(div1, header1);
    			append_dev(header1, h21);
    			append_dev(header1, t6);
    			append_dev(header1, span1);
    			append_dev(span1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, input1);
    			set_input_value(input1, /*g*/ ctx[1]);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, header2);
    			append_dev(header2, h22);
    			append_dev(header2, t11);
    			append_dev(header2, span2);
    			append_dev(span2, t12);
    			append_dev(div2, t13);
    			append_dev(div2, input2);
    			set_input_value(input2, /*b*/ ctx[2]);
    			append_dev(section, t14);
    			append_dev(section, form);
    			append_dev(form, input3);
    			set_input_value(input3, /*hex*/ ctx[4]);
    			append_dev(form, t15);
    			append_dev(form, input4);
    			set_input_value(input4, /*rgb*/ ctx[3]);
    			append_dev(form, t16);
    			append_dev(form, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_input_handler*/ ctx[8]),
    					listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[8]),
    					listen_dev(input0, "input", /*rgbToHex*/ ctx[5], false, false, false),
    					listen_dev(input1, "change", /*input1_change_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*rgbToHex*/ ctx[5], false, false, false),
    					listen_dev(input2, "change", /*input2_change_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_change_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*rgbToHex*/ ctx[5], false, false, false),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[11]),
    					listen_dev(input3, "input", /*hexToRgb*/ ctx[6], false, false, false),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[12]),
    					listen_dev(form, "submit", /*sendMessage*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*r*/ 1) set_data_dev(t2, /*r*/ ctx[0]);

    			if (dirty & /*r*/ 1) {
    				set_input_value(input0, /*r*/ ctx[0]);
    			}

    			if (dirty & /*g*/ 2) set_data_dev(t7, /*g*/ ctx[1]);

    			if (dirty & /*g*/ 2) {
    				set_input_value(input1, /*g*/ ctx[1]);
    			}

    			if (dirty & /*b*/ 4) set_data_dev(t12, /*b*/ ctx[2]);

    			if (dirty & /*b*/ 4) {
    				set_input_value(input2, /*b*/ ctx[2]);
    			}

    			if (dirty & /*hex*/ 16) {
    				set_input_value(input3, /*hex*/ ctx[4]);
    			}

    			if (dirty & /*rgb*/ 8 && input4.value !== /*rgb*/ ctx[3]) {
    				set_input_value(input4, /*rgb*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $currentChatroom;
    	let $socket;
    	let $currentUser;
    	validate_store(currentChatroom, 'currentChatroom');
    	component_subscribe($$self, currentChatroom, $$value => $$invalidate(13, $currentChatroom = $$value));
    	validate_store(socket, 'socket');
    	component_subscribe($$self, socket, $$value => $$invalidate(14, $socket = $$value));
    	validate_store(currentUser, 'currentUser');
    	component_subscribe($$self, currentUser, $$value => $$invalidate(15, $currentUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RGB', slots, []);
    	let r = 0;
    	let g = 0;
    	let b = 0;
    	let rgb = `rgb(${r},${g},${b})`;
    	let hex = '#000000';
    	let saveState = true;

    	function rgbToHex() {
    		const RGB = r << 16 | g << 8 | b << 0;
    		$$invalidate(3, rgb = `rgb(${r},${g},${b})`);
    		$$invalidate(4, hex = '#' + (0x1000000 + RGB).toString(16).slice(1));
    	}

    	function hexToRgb() {
    		const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    		let rgbArray = normal.slice(1).map(e => parseInt(e, 16));
    		$$invalidate(0, r = rgbArray[0]);
    		$$invalidate(1, g = rgbArray[1]);
    		$$invalidate(2, b = rgbArray[2]);
    		$$invalidate(3, rgb = `rgb(${r},${g},${b})`);
    	}

    	const sendMessage = e => {
    		e.preventDefault();

    		const payload = {
    			target: $currentChatroom._id,
    			save: saveState,
    			message: {
    				senderID: $currentUser._id,
    				senderName: $currentUser.name,
    				color: $currentUser.color,
    				text: $currentUser.text,
    				type: 'rgb',
    				msg: e.target.message.value,
    				timestamp: Date.now()
    			}
    		};

    		$socket.emit('chatroom:message', payload);
    		$currentChatroom.messages.push(payload.message);
    		currentChatroom.set($currentChatroom);
    		console.log('%c Color Sent: ', 'background-color:rgb(199, 176, 92); color:black; font-weight: bold;');
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<RGB> was created with unknown prop '${key}'`);
    	});

    	function input0_change_input_handler() {
    		r = to_number(this.value);
    		$$invalidate(0, r);
    	}

    	function input1_change_input_handler() {
    		g = to_number(this.value);
    		$$invalidate(1, g);
    	}

    	function input2_change_input_handler() {
    		b = to_number(this.value);
    		$$invalidate(2, b);
    	}

    	function input3_input_handler() {
    		hex = this.value;
    		$$invalidate(4, hex);
    	}

    	function input4_input_handler() {
    		rgb = this.value;
    		$$invalidate(3, rgb);
    	}

    	$$self.$capture_state = () => ({
    		socket,
    		currentUser,
    		currentChatroom,
    		r,
    		g,
    		b,
    		rgb,
    		hex,
    		saveState,
    		rgbToHex,
    		hexToRgb,
    		sendMessage,
    		$currentChatroom,
    		$socket,
    		$currentUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('r' in $$props) $$invalidate(0, r = $$props.r);
    		if ('g' in $$props) $$invalidate(1, g = $$props.g);
    		if ('b' in $$props) $$invalidate(2, b = $$props.b);
    		if ('rgb' in $$props) $$invalidate(3, rgb = $$props.rgb);
    		if ('hex' in $$props) $$invalidate(4, hex = $$props.hex);
    		if ('saveState' in $$props) saveState = $$props.saveState;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		r,
    		g,
    		b,
    		rgb,
    		hex,
    		rgbToHex,
    		hexToRgb,
    		sendMessage,
    		input0_change_input_handler,
    		input1_change_input_handler,
    		input2_change_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class RGB extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RGB",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\Switch.svelte generated by Svelte v3.55.1 */

    const file$5 = "src\\components\\Switch.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let div1_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "thumb svelte-1q8zce");
    			add_location(div0, file$5, 9, 2, 192);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*state*/ ctx[0] ? 'switch on' : 'switch off') + " svelte-1q8zce"));
    			add_location(div1, file$5, 8, 0, 104);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*toggle*/ ctx[1], false, false, false),
    					listen_dev(div1, "keydown", null, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*state*/ 1 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*state*/ ctx[0] ? 'switch on' : 'switch off') + " svelte-1q8zce"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Switch', slots, []);
    	let { state = false } = $$props;

    	const toggle = () => {
    		$$invalidate(0, state = !state);
    	};

    	const writable_props = ['state'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Switch> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({ state, toggle });

    	$$self.$inject_state = $$props => {
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [state, toggle];
    }

    class Switch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { state: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Switch",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get state() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Chat\Keyboard.svelte generated by Svelte v3.55.1 */

    const { console: console_1$3 } = globals;
    const file$4 = "src\\components\\Chat\\Keyboard.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (59:4) {#each keys as key}
    function create_each_block$1(ctx) {
    	let span;
    	let t_value = /*key*/ ctx[9] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "key svelte-n24kfk");
    			add_location(span, file$4, 59, 6, 1499);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*keys*/ 1 && t_value !== (t_value = /*key*/ ctx[9] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(59:4) {#each keys as key}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let header;
    	let h2;
    	let t1;
    	let div0;
    	let spanl;
    	let t3;
    	let switch_1;
    	let updating_state;
    	let t4;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;

    	function switch_1_state_binding(value) {
    		/*switch_1_state_binding*/ ctx[4](value);
    	}

    	let switch_1_props = {};

    	if (/*saveState*/ ctx[1] !== void 0) {
    		switch_1_props.state = /*saveState*/ ctx[1];
    	}

    	switch_1 = new Switch({ props: switch_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(switch_1, 'state', switch_1_state_binding));
    	let each_value = /*keys*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			header = element("header");
    			h2 = element("h2");
    			h2.textContent = "Keyboard Contoller";
    			t1 = space();
    			div0 = element("div");
    			spanl = element("spanl");
    			spanl.textContent = "Save: ";
    			t3 = space();
    			create_component(switch_1.$$.fragment);
    			t4 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "svelte-n24kfk");
    			add_location(h2, file$4, 49, 4, 1228);
    			add_location(spanl, file$4, 51, 6, 1299);
    			attr_dev(div0, "class", "switch-contianer svelte-n24kfk");
    			add_location(div0, file$4, 50, 4, 1261);
    			attr_dev(header, "class", "svelte-n24kfk");
    			add_location(header, file$4, 48, 2, 1214);
    			attr_dev(div1, "class", "key-container svelte-n24kfk");
    			add_location(div1, file$4, 56, 2, 1396);
    			attr_dev(section, "class", "svelte-n24kfk");
    			add_location(section, file$4, 47, 0, 1201);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, header);
    			append_dev(header, h2);
    			append_dev(header, t1);
    			append_dev(header, div0);
    			append_dev(div0, spanl);
    			append_dev(div0, t3);
    			mount_component(switch_1, div0, null);
    			append_dev(section, t4);
    			append_dev(section, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*keyDown*/ ctx[2], false, false, false),
    					listen_dev(window, "keyup", /*keyUp*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_1_changes = {};

    			if (!updating_state && dirty & /*saveState*/ 2) {
    				updating_state = true;
    				switch_1_changes.state = /*saveState*/ ctx[1];
    				add_flush_callback(() => updating_state = false);
    			}

    			switch_1.$set(switch_1_changes);

    			if (dirty & /*keys*/ 1) {
    				each_value = /*keys*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(switch_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(switch_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(switch_1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $socket;
    	let $currentUser;
    	let $currentChatroom;
    	validate_store(socket, 'socket');
    	component_subscribe($$self, socket, $$value => $$invalidate(5, $socket = $$value));
    	validate_store(currentUser, 'currentUser');
    	component_subscribe($$self, currentUser, $$value => $$invalidate(6, $currentUser = $$value));
    	validate_store(currentChatroom, 'currentChatroom');
    	component_subscribe($$self, currentChatroom, $$value => $$invalidate(7, $currentChatroom = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Keyboard', slots, []);
    	let keys = [];
    	let saveState = false;

    	const updateStore = () => {
    		const payload = {
    			target: $currentChatroom._id,
    			save: saveState,
    			message: {
    				senderID: $currentUser._id,
    				senderName: $currentUser.name,
    				color: $currentUser.color,
    				text: $currentUser.text,
    				type: 'keyboard',
    				msg: keys.join(),
    				timestamp: Date.now()
    			}
    		};

    		$socket.emit('chatroom:message', payload);
    		console.log(keys);
    	}; // THIS SLOW DOWN THE CLIENT A LOT
    	// $currentChatroom.messages.push(payload.message)
    	// $currentChatroom = $currentChatroom

    	const keyDown = e => {
    		if (keys.includes(e.code) === false) {
    			e.preventDefault();
    			$$invalidate(0, keys = [...keys, e.code]);
    			updateStore();
    		}
    	};

    	const keyUp = e => {
    		$$invalidate(0, keys = keys.filter(key => key !== e.code));
    		updateStore();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Keyboard> was created with unknown prop '${key}'`);
    	});

    	function switch_1_state_binding(value) {
    		saveState = value;
    		$$invalidate(1, saveState);
    	}

    	$$self.$capture_state = () => ({
    		socket,
    		currentUser,
    		currentChatroom,
    		Switch,
    		keys,
    		saveState,
    		updateStore,
    		keyDown,
    		keyUp,
    		$socket,
    		$currentUser,
    		$currentChatroom
    	});

    	$$self.$inject_state = $$props => {
    		if ('keys' in $$props) $$invalidate(0, keys = $$props.keys);
    		if ('saveState' in $$props) $$invalidate(1, saveState = $$props.saveState);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [keys, saveState, keyDown, keyUp, switch_1_state_binding];
    }

    class Keyboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Keyboard",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Chat\Gamepad.svelte generated by Svelte v3.55.1 */

    const { console: console_1$2 } = globals;
    const file$3 = "src\\components\\Chat\\Gamepad.svelte";

    // (152:2) {#if gamepads[0] === null}
    function create_if_block$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Please connect a controller";
    			attr_dev(div, "class", "warning svelte-1pf0thz");
    			add_location(div, file$3, 152, 4, 3371);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(152:2) {#if gamepads[0] === null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section;
    	let header;
    	let h2;
    	let t1;
    	let div0;
    	let spanl;
    	let t3;
    	let switch_1;
    	let updating_state;
    	let t4;
    	let t5;
    	let div15;
    	let div3;
    	let button0;
    	let t6;
    	let div2;
    	let div1;
    	let t7;
    	let div4;
    	let button1;
    	let t8;
    	let button2;
    	let t9;
    	let button3;
    	let t10;
    	let button4;
    	let t11;
    	let div7;
    	let div6;
    	let div5;
    	let t12;
    	let div10;
    	let div9;
    	let div8;
    	let t13;
    	let div11;
    	let button5;
    	let t14;
    	let button6;
    	let t15;
    	let button7;
    	let t16;
    	let button8;
    	let t17;
    	let div14;
    	let button9;
    	let t18;
    	let div13;
    	let div12;
    	let current;
    	let mounted;
    	let dispose;

    	function switch_1_state_binding(value) {
    		/*switch_1_state_binding*/ ctx[8](value);
    	}

    	let switch_1_props = {};

    	if (/*saveState*/ ctx[2] !== void 0) {
    		switch_1_props.state = /*saveState*/ ctx[2];
    	}

    	switch_1 = new Switch({ props: switch_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(switch_1, 'state', switch_1_state_binding));
    	let if_block = /*gamepads*/ ctx[1][0] === null && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			header = element("header");
    			h2 = element("h2");
    			h2.textContent = "Gamepad Contoller";
    			t1 = space();
    			div0 = element("div");
    			spanl = element("spanl");
    			spanl.textContent = "Save: ";
    			t3 = space();
    			create_component(switch_1.$$.fragment);
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			div15 = element("div");
    			div3 = element("div");
    			button0 = element("button");
    			t6 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t7 = space();
    			div4 = element("div");
    			button1 = element("button");
    			t8 = space();
    			button2 = element("button");
    			t9 = space();
    			button3 = element("button");
    			t10 = space();
    			button4 = element("button");
    			t11 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			t12 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			t13 = space();
    			div11 = element("div");
    			button5 = element("button");
    			t14 = space();
    			button6 = element("button");
    			t15 = space();
    			button7 = element("button");
    			t16 = space();
    			button8 = element("button");
    			t17 = space();
    			div14 = element("div");
    			button9 = element("button");
    			t18 = space();
    			div13 = element("div");
    			div12 = element("div");
    			attr_dev(h2, "class", "svelte-1pf0thz");
    			add_location(h2, file$3, 144, 4, 3172);
    			attr_dev(spanl, "class", "svelte-1pf0thz");
    			add_location(spanl, file$3, 146, 6, 3242);
    			attr_dev(div0, "class", "switch-contianer svelte-1pf0thz");
    			add_location(div0, file$3, 145, 4, 3204);
    			attr_dev(header, "class", "svelte-1pf0thz");
    			add_location(header, file$3, 143, 2, 3158);
    			attr_dev(button0, "class", "button svelte-1pf0thz");
    			toggle_class(button0, "on", /*buttonMap*/ ctx[0].lb);
    			add_location(button0, file$3, 156, 6, 3501);
    			set_style(div1, "height", /*buttonMap*/ ctx[0].lt * 100 + "%");
    			attr_dev(div1, "class", "svelte-1pf0thz");
    			add_location(div1, file$3, 157, 27, 3579);
    			attr_dev(div2, "class", "trigger svelte-1pf0thz");
    			add_location(div2, file$3, 157, 6, 3558);
    			attr_dev(div3, "class", "shoulder-group svelte-1pf0thz");
    			add_location(div3, file$3, 155, 4, 3465);
    			attr_dev(button1, "class", "button down svelte-1pf0thz");
    			toggle_class(button1, "on", /*buttonMap*/ ctx[0].dd);
    			add_location(button1, file$3, 161, 6, 3684);
    			attr_dev(button2, "class", "button right svelte-1pf0thz");
    			toggle_class(button2, "on", /*buttonMap*/ ctx[0].dr);
    			add_location(button2, file$3, 162, 6, 3746);
    			attr_dev(button3, "class", "button left svelte-1pf0thz");
    			toggle_class(button3, "on", /*buttonMap*/ ctx[0].dl);
    			add_location(button3, file$3, 163, 6, 3809);
    			attr_dev(button4, "class", "button up svelte-1pf0thz");
    			toggle_class(button4, "on", /*buttonMap*/ ctx[0].du);
    			add_location(button4, file$3, 164, 6, 3871);
    			attr_dev(div4, "class", "button-group svelte-1pf0thz");
    			add_location(div4, file$3, 160, 4, 3650);
    			set_style(div5, "transform", /*stickl*/ ctx[4]());
    			attr_dev(div5, "class", "svelte-1pf0thz");
    			toggle_class(div5, "on", /*buttonMap*/ ctx[0].lstick);
    			add_location(div5, file$3, 168, 8, 4007);
    			attr_dev(div6, "class", "stick svelte-1pf0thz");
    			add_location(div6, file$3, 167, 6, 3978);
    			attr_dev(div7, "class", "stick-container svelte-1pf0thz");
    			add_location(div7, file$3, 166, 4, 3941);
    			set_style(div8, "transform", /*stickr*/ ctx[3]());
    			attr_dev(div8, "class", "svelte-1pf0thz");
    			toggle_class(div8, "on", /*buttonMap*/ ctx[0].rstick);
    			add_location(div8, file$3, 174, 8, 4172);
    			attr_dev(div9, "class", "stick svelte-1pf0thz");
    			add_location(div9, file$3, 173, 6, 4143);
    			attr_dev(div10, "class", "stick-container svelte-1pf0thz");
    			add_location(div10, file$3, 172, 4, 4106);
    			attr_dev(button5, "class", "button down svelte-1pf0thz");
    			toggle_class(button5, "on", /*buttonMap*/ ctx[0].a);
    			add_location(button5, file$3, 179, 6, 4305);
    			attr_dev(button6, "class", "button right svelte-1pf0thz");
    			toggle_class(button6, "on", /*buttonMap*/ ctx[0].b);
    			add_location(button6, file$3, 180, 6, 4366);
    			attr_dev(button7, "class", "button left svelte-1pf0thz");
    			toggle_class(button7, "on", /*buttonMap*/ ctx[0].x);
    			add_location(button7, file$3, 181, 6, 4428);
    			attr_dev(button8, "class", "button up svelte-1pf0thz");
    			toggle_class(button8, "on", /*buttonMap*/ ctx[0].y);
    			add_location(button8, file$3, 182, 6, 4489);
    			attr_dev(div11, "class", "button-group svelte-1pf0thz");
    			add_location(div11, file$3, 178, 4, 4271);
    			attr_dev(button9, "class", "button svelte-1pf0thz");
    			toggle_class(button9, "on", /*buttonMap*/ ctx[0].rb);
    			add_location(button9, file$3, 185, 6, 4594);
    			set_style(div12, "height", /*buttonMap*/ ctx[0].rt * 100 + "%");
    			attr_dev(div12, "class", "svelte-1pf0thz");
    			add_location(div12, file$3, 186, 27, 4672);
    			attr_dev(div13, "class", "trigger svelte-1pf0thz");
    			add_location(div13, file$3, 186, 6, 4651);
    			attr_dev(div14, "class", "shoulder-group svelte-1pf0thz");
    			add_location(div14, file$3, 184, 4, 4558);
    			attr_dev(div15, "class", "gamepad svelte-1pf0thz");
    			add_location(div15, file$3, 154, 2, 3438);
    			attr_dev(section, "class", "svelte-1pf0thz");
    			add_location(section, file$3, 142, 0, 3145);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, header);
    			append_dev(header, h2);
    			append_dev(header, t1);
    			append_dev(header, div0);
    			append_dev(div0, spanl);
    			append_dev(div0, t3);
    			mount_component(switch_1, div0, null);
    			append_dev(section, t4);
    			if (if_block) if_block.m(section, null);
    			append_dev(section, t5);
    			append_dev(section, div15);
    			append_dev(div15, div3);
    			append_dev(div3, button0);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div15, t7);
    			append_dev(div15, div4);
    			append_dev(div4, button1);
    			append_dev(div4, t8);
    			append_dev(div4, button2);
    			append_dev(div4, t9);
    			append_dev(div4, button3);
    			append_dev(div4, t10);
    			append_dev(div4, button4);
    			append_dev(div15, t11);
    			append_dev(div15, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div15, t12);
    			append_dev(div15, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div15, t13);
    			append_dev(div15, div11);
    			append_dev(div11, button5);
    			append_dev(div11, t14);
    			append_dev(div11, button6);
    			append_dev(div11, t15);
    			append_dev(div11, button7);
    			append_dev(div11, t16);
    			append_dev(div11, button8);
    			append_dev(div15, t17);
    			append_dev(div15, div14);
    			append_dev(div14, button9);
    			append_dev(div14, t18);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "gamepadconnected", /*plugIn*/ ctx[5], false, false, false),
    					listen_dev(window, "gamepaddisconnected", /*unPlug*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_1_changes = {};

    			if (!updating_state && dirty & /*saveState*/ 4) {
    				updating_state = true;
    				switch_1_changes.state = /*saveState*/ ctx[2];
    				add_flush_callback(() => updating_state = false);
    			}

    			switch_1.$set(switch_1_changes);

    			if (/*gamepads*/ ctx[1][0] === null) {
    				if (if_block) ; else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(section, t5);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				toggle_class(button0, "on", /*buttonMap*/ ctx[0].lb);
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				set_style(div1, "height", /*buttonMap*/ ctx[0].lt * 100 + "%");
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				toggle_class(button1, "on", /*buttonMap*/ ctx[0].dd);
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				toggle_class(button2, "on", /*buttonMap*/ ctx[0].dr);
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				toggle_class(button3, "on", /*buttonMap*/ ctx[0].dl);
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				toggle_class(button4, "on", /*buttonMap*/ ctx[0].du);
    			}

    			if (!current || dirty & /*stickl*/ 16) {
    				set_style(div5, "transform", /*stickl*/ ctx[4]());
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				toggle_class(div5, "on", /*buttonMap*/ ctx[0].lstick);
    			}

    			if (!current || dirty & /*stickr*/ 8) {
    				set_style(div8, "transform", /*stickr*/ ctx[3]());
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				toggle_class(div8, "on", /*buttonMap*/ ctx[0].rstick);
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				toggle_class(button5, "on", /*buttonMap*/ ctx[0].a);
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				toggle_class(button6, "on", /*buttonMap*/ ctx[0].b);
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				toggle_class(button7, "on", /*buttonMap*/ ctx[0].x);
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				toggle_class(button8, "on", /*buttonMap*/ ctx[0].y);
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				toggle_class(button9, "on", /*buttonMap*/ ctx[0].rb);
    			}

    			if (!current || dirty & /*buttonMap*/ 1) {
    				set_style(div12, "height", /*buttonMap*/ ctx[0].rt * 100 + "%");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(switch_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(switch_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(switch_1);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let stickl;
    	let stickr;
    	let $socket;
    	let $currentUser;
    	let $currentChatroom;
    	validate_store(socket, 'socket');
    	component_subscribe($$self, socket, $$value => $$invalidate(11, $socket = $$value));
    	validate_store(currentUser, 'currentUser');
    	component_subscribe($$self, currentUser, $$value => $$invalidate(12, $currentUser = $$value));
    	validate_store(currentChatroom, 'currentChatroom');
    	component_subscribe($$self, currentChatroom, $$value => $$invalidate(13, $currentChatroom = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gamepad', slots, []);
    	let poll;
    	let gamepads = navigator.getGamepads();
    	let lastMessage;
    	let saveState = false;

    	let buttonMap = {
    		a: 0,
    		b: 0,
    		x: 0,
    		y: 0,
    		lb: 0,
    		rb: 0,
    		lt: 0,
    		rt: 0,
    		map: 0,
    		menu: 0,
    		lstick: 0,
    		rstick: 0,
    		du: 0,
    		dd: 0,
    		dl: 0,
    		dr: 0,
    		xbox: 0
    	};

    	let axisMap = { lx: 0, ly: 0, rx: 0, ry: 0 };

    	const plugIn = () => {
    		startController();
    	};

    	const unPlug = () => {
    		cancelAnimationFrame(poll);
    	};

    	const startController = () => {
    		$$invalidate(1, gamepads = navigator.getGamepads());

    		if (!gamepads) {
    			return;
    		}

    		const pad = gamepads[0];

    		const buttons = [
    			'a',
    			'b',
    			'x',
    			'y',
    			'lb',
    			'rb',
    			'lt',
    			'rt',
    			'map',
    			'menu',
    			'lstick',
    			'rstick',
    			'du',
    			'dd',
    			'dl',
    			'dr',
    			'xbox'
    		];

    		const axes = ['lx', 'ly', 'rx', 'ry'];

    		pad.buttons.forEach((button, i) => {
    			$$invalidate(0, buttonMap[buttons[i]] = button.pressed ? button.value : 0, buttonMap);
    		});

    		pad.axes.forEach((axis, i) => {
    			$$invalidate(
    				7,
    				axisMap[axes[i]] = axis > 0.01 || axis < -0.01
    				? parseFloat(axis.toFixed(3))
    				: 0,
    				axisMap
    			);
    		});

    		if (lastMessage != JSON.stringify({ buttonMap, axisMap })) {
    			lastMessage = JSON.stringify({ buttonMap, axisMap });

    			const payload = {
    				target: $currentChatroom._id,
    				save: saveState,
    				message: {
    					senderID: $currentUser._id,
    					senderName: $currentUser.name,
    					color: $currentUser.color,
    					text: $currentUser.text,
    					type: 'gamepad',
    					msg: lastMessage,
    					timestamp: Date.now()
    				}
    			};

    			$socket.emit('chatroom:message', payload);
    			console.log({ buttonMap, axisMap });
    			// $currentChatroom.messages.push(payload.message)
    		} // $currentChatroom = $currentChatroom

    		poll = requestAnimationFrame(startController);
    	};

    	onMount(() => {
    		gamepads[0] && startController();
    	});

    	onDestroy(() => unPlug());
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Gamepad> was created with unknown prop '${key}'`);
    	});

    	function switch_1_state_binding(value) {
    		saveState = value;
    		$$invalidate(2, saveState);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		socket,
    		currentUser,
    		currentChatroom,
    		Switch,
    		poll,
    		gamepads,
    		lastMessage,
    		saveState,
    		buttonMap,
    		axisMap,
    		plugIn,
    		unPlug,
    		startController,
    		stickr,
    		stickl,
    		$socket,
    		$currentUser,
    		$currentChatroom
    	});

    	$$self.$inject_state = $$props => {
    		if ('poll' in $$props) poll = $$props.poll;
    		if ('gamepads' in $$props) $$invalidate(1, gamepads = $$props.gamepads);
    		if ('lastMessage' in $$props) lastMessage = $$props.lastMessage;
    		if ('saveState' in $$props) $$invalidate(2, saveState = $$props.saveState);
    		if ('buttonMap' in $$props) $$invalidate(0, buttonMap = $$props.buttonMap);
    		if ('axisMap' in $$props) $$invalidate(7, axisMap = $$props.axisMap);
    		if ('stickr' in $$props) $$invalidate(3, stickr = $$props.stickr);
    		if ('stickl' in $$props) $$invalidate(4, stickl = $$props.stickl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*axisMap, buttonMap*/ 129) {
    			$$invalidate(4, stickl = () => {
    				let x = axisMap.lx * 40;
    				let y = axisMap.ly * 40;
    				let rx = axisMap.lx * 10;
    				let ry = axisMap.ly * 10;
    				let z = 1 - buttonMap.lstick * 0.05;
    				return `translateX(${x}%) translateY(${y}%) rotateY(${rx}deg) rotateX(${ry}deg) scale(${z})`;
    			});
    		}

    		if ($$self.$$.dirty & /*axisMap, buttonMap*/ 129) {
    			$$invalidate(3, stickr = () => {
    				let x = axisMap.rx * 40;
    				let y = axisMap.ry * 40;
    				let rx = axisMap.rx * 10;
    				let ry = axisMap.ry * 10;
    				let z = 1 - buttonMap.rstick * 0.05;
    				return `translateX(${x}%) translateY(${y}%) rotateY(${rx}deg) rotateX(${ry}deg) scale(${z})`;
    			});
    		}
    	};

    	return [
    		buttonMap,
    		gamepads,
    		saveState,
    		stickr,
    		stickl,
    		plugIn,
    		unPlug,
    		axisMap,
    		switch_1_state_binding
    	];
    }

    class Gamepad extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gamepad",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\Chat\Log.svelte generated by Svelte v3.55.1 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\components\\Chat\\Log.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (193:2) {#if showDetails === true}
    function create_if_block_5$1(ctx) {
    	let div2;
    	let div0;
    	let table;
    	let tr0;
    	let th0;
    	let t1;
    	let td0;
    	let t2_value = /*$currentChatroom*/ ctx[3].ownerName + "";
    	let t2;
    	let t3;
    	let tr1;
    	let th1;
    	let t5;
    	let td1;
    	let span0;
    	let t6_value = formatDate(new Date(/*$currentChatroom*/ ctx[3].createdAt)) + "";
    	let t6;
    	let t7;
    	let span1;
    	let t8_value = formatAMPM(new Date(/*$currentChatroom*/ ctx[3].createdAt)) + "";
    	let t8;
    	let t9;
    	let tr2;
    	let th2;
    	let t11;
    	let td2;
    	let span2;
    	let t12_value = formatDate(new Date(/*$currentChatroom*/ ctx[3].updatedAt)) + "";
    	let t12;
    	let t13;
    	let span3;
    	let t14_value = formatAMPM(new Date(/*$currentChatroom*/ ctx[3].updatedAt)) + "";
    	let t14;
    	let t15;
    	let current_block_type_index;
    	let if_block0;
    	let t16;
    	let div1;
    	let h3;
    	let t18;
    	let ul;
    	let current;
    	const if_block_creators = [create_if_block_7, create_if_block_8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$currentChatroom*/ ctx[3].ownerID === /*$currentUser*/ ctx[4]._id) return 0;
    		if (/*$currentChatroom*/ ctx[3]._id != 'GLOBAL') return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	let if_block1 = /*$currentChatroom*/ ctx[3].members && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			table = element("table");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Owner:";
    			t1 = space();
    			td0 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			tr1 = element("tr");
    			th1 = element("th");
    			th1.textContent = "Created:";
    			t5 = space();
    			td1 = element("td");
    			span0 = element("span");
    			t6 = text(t6_value);
    			t7 = space();
    			span1 = element("span");
    			t8 = text(t8_value);
    			t9 = space();
    			tr2 = element("tr");
    			th2 = element("th");
    			th2.textContent = "Updated:";
    			t11 = space();
    			td2 = element("td");
    			span2 = element("span");
    			t12 = text(t12_value);
    			t13 = space();
    			span3 = element("span");
    			t14 = text(t14_value);
    			t15 = space();
    			if (if_block0) if_block0.c();
    			t16 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Members";
    			t18 = space();
    			ul = element("ul");
    			if (if_block1) if_block1.c();
    			attr_dev(th0, "class", "svelte-bezf9n");
    			add_location(th0, file$2, 196, 14, 5416);
    			attr_dev(td0, "class", "svelte-bezf9n");
    			add_location(td0, file$2, 196, 30, 5432);
    			attr_dev(tr0, "class", "svelte-bezf9n");
    			add_location(tr0, file$2, 196, 10, 5412);
    			attr_dev(th1, "class", "svelte-bezf9n");
    			add_location(th1, file$2, 198, 13, 5504);
    			attr_dev(span0, "class", "svelte-bezf9n");
    			add_location(span0, file$2, 200, 14, 5555);
    			attr_dev(span1, "class", "svelte-bezf9n");
    			add_location(span1, file$2, 201, 14, 5634);
    			attr_dev(td1, "class", "svelte-bezf9n");
    			add_location(td1, file$2, 199, 12, 5535);
    			attr_dev(tr1, "class", "svelte-bezf9n");
    			add_location(tr1, file$2, 197, 10, 5486);
    			attr_dev(th2, "class", "svelte-bezf9n");
    			add_location(th2, file$2, 205, 13, 5763);
    			attr_dev(span2, "class", "svelte-bezf9n");
    			add_location(span2, file$2, 207, 14, 5814);
    			attr_dev(span3, "class", "svelte-bezf9n");
    			add_location(span3, file$2, 208, 14, 5893);
    			attr_dev(td2, "class", "svelte-bezf9n");
    			add_location(td2, file$2, 206, 12, 5794);
    			attr_dev(tr2, "class", "svelte-bezf9n");
    			add_location(tr2, file$2, 204, 10, 5745);
    			attr_dev(table, "class", "svelte-bezf9n");
    			add_location(table, file$2, 195, 8, 5393);
    			attr_dev(div0, "class", "wrapper svelte-bezf9n");
    			add_location(div0, file$2, 194, 6, 5362);
    			attr_dev(h3, "class", "svelte-bezf9n");
    			add_location(h3, file$2, 219, 8, 6326);
    			attr_dev(ul, "class", "svelte-bezf9n");
    			add_location(ul, file$2, 220, 8, 6352);
    			attr_dev(div1, "class", "members-list svelte-bezf9n");
    			add_location(div1, file$2, 218, 6, 6290);
    			attr_dev(div2, "class", "details svelte-bezf9n");
    			add_location(div2, file$2, 193, 4, 5333);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, table);
    			append_dev(table, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td0);
    			append_dev(td0, t2);
    			append_dev(table, t3);
    			append_dev(table, tr1);
    			append_dev(tr1, th1);
    			append_dev(tr1, t5);
    			append_dev(tr1, td1);
    			append_dev(td1, span0);
    			append_dev(span0, t6);
    			append_dev(td1, t7);
    			append_dev(td1, span1);
    			append_dev(span1, t8);
    			append_dev(table, t9);
    			append_dev(table, tr2);
    			append_dev(tr2, th2);
    			append_dev(tr2, t11);
    			append_dev(tr2, td2);
    			append_dev(td2, span2);
    			append_dev(span2, t12);
    			append_dev(td2, t13);
    			append_dev(td2, span3);
    			append_dev(span3, t14);
    			append_dev(div0, t15);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div0, null);
    			}

    			append_dev(div2, t16);
    			append_dev(div2, div1);
    			append_dev(div1, h3);
    			append_dev(div1, t18);
    			append_dev(div1, ul);
    			if (if_block1) if_block1.m(ul, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$currentChatroom*/ 8) && t2_value !== (t2_value = /*$currentChatroom*/ ctx[3].ownerName + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*$currentChatroom*/ 8) && t6_value !== (t6_value = formatDate(new Date(/*$currentChatroom*/ ctx[3].createdAt)) + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*$currentChatroom*/ 8) && t8_value !== (t8_value = formatAMPM(new Date(/*$currentChatroom*/ ctx[3].createdAt)) + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*$currentChatroom*/ 8) && t12_value !== (t12_value = formatDate(new Date(/*$currentChatroom*/ ctx[3].updatedAt)) + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*$currentChatroom*/ 8) && t14_value !== (t14_value = formatAMPM(new Date(/*$currentChatroom*/ ctx[3].updatedAt)) + "")) set_data_dev(t14, t14_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block0) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block0 = if_blocks[current_block_type_index];

    					if (!if_block0) {
    						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block0.c();
    					} else {
    						if_block0.p(ctx, dirty);
    					}

    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				} else {
    					if_block0 = null;
    				}
    			}

    			if (/*$currentChatroom*/ ctx[3].members) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					if_block1.m(ul, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(193:2) {#if showDetails === true}",
    		ctx
    	});

    	return block;
    }

    // (215:51) 
    function create_if_block_8(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Leave";
    			attr_dev(button, "class", "svelte-bezf9n");
    			add_location(button, file$2, 215, 10, 6210);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*leaveRoom*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(215:51) ",
    		ctx
    	});

    	return block;
    }

    // (213:8) {#if $currentChatroom.ownerID === $currentUser._id}
    function create_if_block_7(ctx) {
    	let deletebutton;
    	let current;

    	deletebutton = new DeleteButton({
    			props: {
    				label: 'Delete Chatroom',
    				action: /*deleteRoom*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(deletebutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(deletebutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(deletebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(deletebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(deletebutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(213:8) {#if $currentChatroom.ownerID === $currentUser._id}",
    		ctx
    	});

    	return block;
    }

    // (222:10) {#if $currentChatroom.members}
    function create_if_block_6(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*$currentChatroom*/ ctx[3].members;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentChatroom*/ 8) {
    				each_value_1 = /*$currentChatroom*/ ctx[3].members;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(222:10) {#if $currentChatroom.members}",
    		ctx
    	});

    	return block;
    }

    // (223:12) {#each $currentChatroom.members as member}
    function create_each_block_1(ctx) {
    	let li;
    	let t0_value = /*member*/ ctx[18].name + "";
    	let t0;
    	let t1;
    	let li_id_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "class", "members-list-item svelte-bezf9n");
    			attr_dev(li, "id", li_id_value = /*member*/ ctx[18]._id);
    			set_style(li, "background-color", /*member*/ ctx[18].color);
    			set_style(li, "color", /*member*/ ctx[18].text);
    			add_location(li, file$2, 223, 14, 6470);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentChatroom*/ 8 && t0_value !== (t0_value = /*member*/ ctx[18].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$currentChatroom*/ 8 && li_id_value !== (li_id_value = /*member*/ ctx[18]._id)) {
    				attr_dev(li, "id", li_id_value);
    			}

    			if (dirty & /*$currentChatroom*/ 8) {
    				set_style(li, "background-color", /*member*/ ctx[18].color);
    			}

    			if (dirty & /*$currentChatroom*/ 8) {
    				set_style(li, "color", /*member*/ ctx[18].text);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(223:12) {#each $currentChatroom.members as member}",
    		ctx
    	});

    	return block;
    }

    // (239:4) {#if $currentChatroom.messages}
    function create_if_block_4$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$currentChatroom*/ ctx[3].messages;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentUser, $currentChatroom*/ 24) {
    				each_value = /*$currentChatroom*/ ctx[3].messages;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(239:4) {#if $currentChatroom.messages}",
    		ctx
    	});

    	return block;
    }

    // (240:6) {#each $currentChatroom.messages as message}
    function create_each_block(ctx) {
    	let message;
    	let current;

    	message = new Message({
    			props: {
    				currentUserID: /*$currentUser*/ ctx[4]._id,
    				message: /*message*/ ctx[15]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(message.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(message, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const message_changes = {};
    			if (dirty & /*$currentUser*/ 16) message_changes.currentUserID = /*$currentUser*/ ctx[4]._id;
    			if (dirty & /*$currentChatroom*/ 8) message_changes.message = /*message*/ ctx[15];
    			message.$set(message_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(message.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(message.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(message, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(240:6) {#each $currentChatroom.messages as message}",
    		ctx
    	});

    	return block;
    }

    // (278:2) {#if selectedTab === 'inputText'}
    function create_if_block_3$1(ctx) {
    	let form;
    	let input;
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "Send";
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "message");
    			attr_dev(input, "id", "message");
    			attr_dev(input, "autocomplete", "off");
    			attr_dev(input, "class", "svelte-bezf9n");
    			add_location(input, file$2, 279, 6, 8154);
    			attr_dev(button, "class", "svelte-bezf9n");
    			add_location(button, file$2, 280, 6, 8230);
    			attr_dev(form, "class", "send-message svelte-bezf9n");
    			add_location(form, file$2, 278, 4, 8095);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			append_dev(form, t0);
    			append_dev(form, button);

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", /*sendMessage*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(278:2) {#if selectedTab === 'inputText'}",
    		ctx
    	});

    	return block;
    }

    // (285:2) {#if selectedTab === 'inputRgb'}
    function create_if_block_2$1(ctx) {
    	let rgb;
    	let current;
    	rgb = new RGB({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(rgb.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(rgb, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rgb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rgb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(rgb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(285:2) {#if selectedTab === 'inputRgb'}",
    		ctx
    	});

    	return block;
    }

    // (289:2) {#if selectedTab === 'inputKeyboard'}
    function create_if_block_1$1(ctx) {
    	let keyboard;
    	let current;
    	keyboard = new Keyboard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(keyboard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(keyboard, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keyboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keyboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(keyboard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(289:2) {#if selectedTab === 'inputKeyboard'}",
    		ctx
    	});

    	return block;
    }

    // (293:2) {#if selectedTab === 'inputGamepad'}
    function create_if_block$2(ctx) {
    	let div;
    	let gamepad;
    	let current;
    	gamepad = new Gamepad({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(gamepad.$$.fragment);
    			attr_dev(div, "class", "gamepad-container svelte-bezf9n");
    			add_location(div, file$2, 293, 4, 8451);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(gamepad, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gamepad.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gamepad.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(gamepad);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(293:2) {#if selectedTab === 'inputGamepad'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let div4;
    	let div1;
    	let button0;
    	let i0;
    	let t0;
    	let div0;
    	let h2;
    	let t1_value = /*$currentChatroom*/ ctx[3].name + "";
    	let t1;
    	let t2;
    	let p;
    	let t3;
    	let t4_value = /*$currentChatroom*/ ctx[3]._id + "";
    	let t4;
    	let t5;
    	let div3;
    	let form;
    	let input;
    	let t6;
    	let button1;
    	let t8;
    	let div2;
    	let span0;
    	let t10;
    	let i1;
    	let t11;
    	let t12;
    	let ul;
    	let t13;
    	let loading_1;
    	let t14;
    	let div6;
    	let div5;
    	let span1;
    	let i2;
    	let span1_class_value;
    	let t15;
    	let span2;
    	let i3;
    	let span2_class_value;
    	let t16;
    	let span3;
    	let i4;
    	let span3_class_value;
    	let t17;
    	let span4;
    	let i5;
    	let span4_class_value;
    	let t18;
    	let t19;
    	let t20;
    	let t21;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*showDetails*/ ctx[1] === true && create_if_block_5$1(ctx);
    	let if_block1 = /*$currentChatroom*/ ctx[3].messages && create_if_block_4$1(ctx);

    	loading_1 = new Loading({
    			props: { status: /*loading*/ ctx[0] },
    			$$inline: true
    		});

    	let if_block2 = /*selectedTab*/ ctx[2] === 'inputText' && create_if_block_3$1(ctx);
    	let if_block3 = /*selectedTab*/ ctx[2] === 'inputRgb' && create_if_block_2$1(ctx);
    	let if_block4 = /*selectedTab*/ ctx[2] === 'inputKeyboard' && create_if_block_1$1(ctx);
    	let if_block5 = /*selectedTab*/ ctx[2] === 'inputGamepad' && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div4 = element("div");
    			div1 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			t0 = space();
    			div0 = element("div");
    			h2 = element("h2");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text("ID: ");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			form = element("form");
    			input = element("input");
    			t6 = space();
    			button1 = element("button");
    			button1.textContent = "Join";
    			t8 = space();
    			div2 = element("div");
    			span0 = element("span");
    			span0.textContent = "Room Details";
    			t10 = space();
    			i1 = element("i");
    			t11 = space();
    			if (if_block0) if_block0.c();
    			t12 = space();
    			ul = element("ul");
    			if (if_block1) if_block1.c();
    			t13 = space();
    			create_component(loading_1.$$.fragment);
    			t14 = space();
    			div6 = element("div");
    			div5 = element("div");
    			span1 = element("span");
    			i2 = element("i");
    			t15 = space();
    			span2 = element("span");
    			i3 = element("i");
    			t16 = space();
    			span3 = element("span");
    			i4 = element("i");
    			t17 = space();
    			span4 = element("span");
    			i5 = element("i");
    			t18 = space();
    			if (if_block2) if_block2.c();
    			t19 = space();
    			if (if_block3) if_block3.c();
    			t20 = space();
    			if (if_block4) if_block4.c();
    			t21 = space();
    			if (if_block5) if_block5.c();
    			attr_dev(i0, "class", "fas fa-copy svelte-bezf9n");
    			add_location(i0, file$2, 173, 9, 4709);
    			attr_dev(button0, "class", "svelte-bezf9n");
    			add_location(button0, file$2, 172, 6, 4628);
    			attr_dev(h2, "class", "svelte-bezf9n");
    			add_location(h2, file$2, 176, 8, 4787);
    			attr_dev(p, "class", "svelte-bezf9n");
    			add_location(p, file$2, 177, 8, 4829);
    			attr_dev(div0, "class", "info svelte-bezf9n");
    			add_location(div0, file$2, 175, 6, 4759);
    			attr_dev(div1, "class", "left svelte-bezf9n");
    			add_location(div1, file$2, 171, 4, 4602);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "joinRoom");
    			attr_dev(input, "placeholder", "Room ID...");
    			attr_dev(input, "class", "svelte-bezf9n");
    			add_location(input, file$2, 183, 8, 4978);
    			attr_dev(button1, "type", "submit");
    			attr_dev(button1, "class", "svelte-bezf9n");
    			add_location(button1, file$2, 184, 8, 5050);
    			attr_dev(form, "class", "join-room svelte-bezf9n");
    			add_location(form, file$2, 182, 6, 4923);
    			attr_dev(span0, "class", "svelte-bezf9n");
    			add_location(span0, file$2, 187, 8, 5178);
    			attr_dev(i1, "id", "detailsArrows");
    			attr_dev(i1, "class", "fas fa-angle-up svelte-bezf9n");
    			add_location(i1, file$2, 188, 8, 5213);
    			attr_dev(div2, "class", "toggle-details-button svelte-bezf9n");
    			add_location(div2, file$2, 186, 6, 5108);
    			attr_dev(div3, "class", "right svelte-bezf9n");
    			add_location(div3, file$2, 181, 4, 4896);
    			attr_dev(div4, "class", "room-header svelte-bezf9n");
    			add_location(div4, file$2, 170, 2, 4571);
    			attr_dev(ul, "class", "log svelte-bezf9n");
    			attr_dev(ul, "id", "scrollDiv");
    			add_location(ul, file$2, 237, 2, 6790);
    			attr_dev(i2, "class", "fa-solid fa-message svelte-bezf9n");
    			attr_dev(i2, "data-tab", "inputText");
    			add_location(i2, file$2, 252, 8, 7252);
    			attr_dev(span1, "class", span1_class_value = "tab " + (/*selectedTab*/ ctx[2] === 'inputText' ? 'selected' : '') + " svelte-bezf9n");
    			attr_dev(span1, "data-tab", "inputText");
    			add_location(span1, file$2, 247, 6, 7099);
    			attr_dev(i3, "class", "fa-solid fa-palette svelte-bezf9n");
    			attr_dev(i3, "data-tab", "inputRgb");
    			add_location(i3, file$2, 259, 8, 7480);
    			attr_dev(span2, "class", span2_class_value = "tab " + (/*selectedTab*/ ctx[2] === 'inputRgb' ? 'selected' : '') + " svelte-bezf9n");
    			attr_dev(span2, "data-tab", "inputRgb");
    			add_location(span2, file$2, 254, 6, 7329);
    			attr_dev(i4, "class", "fa-solid fa-keyboard svelte-bezf9n");
    			attr_dev(i4, "data-tab", "inputKeyboard");
    			add_location(i4, file$2, 266, 8, 7717);

    			attr_dev(span3, "class", span3_class_value = "tab " + (/*selectedTab*/ ctx[2] === 'inputKeyboard'
    			? 'selected'
    			: '') + " svelte-bezf9n");

    			attr_dev(span3, "data-tab", "inputKeyboard");
    			add_location(span3, file$2, 261, 6, 7556);
    			attr_dev(i5, "class", "fa-solid fa-gamepad svelte-bezf9n");
    			attr_dev(i5, "data-tab", "inputGamepad");
    			add_location(i5, file$2, 273, 8, 7958);

    			attr_dev(span4, "class", span4_class_value = "tab " + (/*selectedTab*/ ctx[2] === 'inputGamepad'
    			? 'selected'
    			: '') + " svelte-bezf9n");

    			attr_dev(span4, "data-tab", "inputGamepad");
    			add_location(span4, file$2, 268, 6, 7799);
    			attr_dev(div5, "class", "tabs svelte-bezf9n");
    			add_location(div5, file$2, 246, 4, 7073);
    			attr_dev(div6, "class", "inputs svelte-bezf9n");
    			add_location(div6, file$2, 245, 2, 7047);
    			attr_dev(section, "class", "chatlog svelte-bezf9n");
    			add_location(section, file$2, 169, 0, 4542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div4);
    			append_dev(div4, div1);
    			append_dev(div1, button0);
    			append_dev(button0, i0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t1);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, form);
    			append_dev(form, input);
    			append_dev(form, t6);
    			append_dev(form, button1);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, span0);
    			append_dev(div2, t10);
    			append_dev(div2, i1);
    			append_dev(section, t11);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t12);
    			append_dev(section, ul);
    			if (if_block1) if_block1.m(ul, null);
    			append_dev(ul, t13);
    			mount_component(loading_1, ul, null);
    			append_dev(section, t14);
    			append_dev(section, div6);
    			append_dev(div6, div5);
    			append_dev(div5, span1);
    			append_dev(span1, i2);
    			append_dev(div5, t15);
    			append_dev(div5, span2);
    			append_dev(span2, i3);
    			append_dev(div5, t16);
    			append_dev(div5, span3);
    			append_dev(span3, i4);
    			append_dev(div5, t17);
    			append_dev(div5, span4);
    			append_dev(span4, i5);
    			append_dev(section, t18);
    			if (if_block2) if_block2.m(section, null);
    			append_dev(section, t19);
    			if (if_block3) if_block3.m(section, null);
    			append_dev(section, t20);
    			if (if_block4) if_block4.m(section, null);
    			append_dev(section, t21);
    			if (if_block5) if_block5.m(section, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(navigator.clipboard.writeText(/*$currentChatroom*/ ctx[3]._id))) navigator.clipboard.writeText(/*$currentChatroom*/ ctx[3]._id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(form, "submit", /*joinRoom*/ ctx[7], false, false, false),
    					listen_dev(div2, "click", /*toggleDetails*/ ctx[5], false, false, false),
    					listen_dev(span1, "click", /*selectTab*/ ctx[6], false, false, false),
    					listen_dev(span2, "click", /*selectTab*/ ctx[6], false, false, false),
    					listen_dev(span3, "click", /*selectTab*/ ctx[6], false, false, false),
    					listen_dev(span4, "click", /*selectTab*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*$currentChatroom*/ 8) && t1_value !== (t1_value = /*$currentChatroom*/ ctx[3].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*$currentChatroom*/ 8) && t4_value !== (t4_value = /*$currentChatroom*/ ctx[3]._id + "")) set_data_dev(t4, t4_value);

    			if (/*showDetails*/ ctx[1] === true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*showDetails*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(section, t12);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$currentChatroom*/ ctx[3].messages) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$currentChatroom*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_4$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(ul, t13);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const loading_1_changes = {};
    			if (dirty & /*loading*/ 1) loading_1_changes.status = /*loading*/ ctx[0];
    			loading_1.$set(loading_1_changes);

    			if (!current || dirty & /*selectedTab*/ 4 && span1_class_value !== (span1_class_value = "tab " + (/*selectedTab*/ ctx[2] === 'inputText' ? 'selected' : '') + " svelte-bezf9n")) {
    				attr_dev(span1, "class", span1_class_value);
    			}

    			if (!current || dirty & /*selectedTab*/ 4 && span2_class_value !== (span2_class_value = "tab " + (/*selectedTab*/ ctx[2] === 'inputRgb' ? 'selected' : '') + " svelte-bezf9n")) {
    				attr_dev(span2, "class", span2_class_value);
    			}

    			if (!current || dirty & /*selectedTab*/ 4 && span3_class_value !== (span3_class_value = "tab " + (/*selectedTab*/ ctx[2] === 'inputKeyboard'
    			? 'selected'
    			: '') + " svelte-bezf9n")) {
    				attr_dev(span3, "class", span3_class_value);
    			}

    			if (!current || dirty & /*selectedTab*/ 4 && span4_class_value !== (span4_class_value = "tab " + (/*selectedTab*/ ctx[2] === 'inputGamepad'
    			? 'selected'
    			: '') + " svelte-bezf9n")) {
    				attr_dev(span4, "class", span4_class_value);
    			}

    			if (/*selectedTab*/ ctx[2] === 'inputText') {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3$1(ctx);
    					if_block2.c();
    					if_block2.m(section, t19);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*selectedTab*/ ctx[2] === 'inputRgb') {
    				if (if_block3) {
    					if (dirty & /*selectedTab*/ 4) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_2$1(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(section, t20);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*selectedTab*/ ctx[2] === 'inputKeyboard') {
    				if (if_block4) {
    					if (dirty & /*selectedTab*/ 4) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_1$1(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(section, t21);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*selectedTab*/ ctx[2] === 'inputGamepad') {
    				if (if_block5) {
    					if (dirty & /*selectedTab*/ 4) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block$2(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(section, null);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(loading_1.$$.fragment, local);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(loading_1.$$.fragment, local);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(loading_1);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $currentChatroom;
    	let $socket;
    	let $currentUser;
    	validate_store(currentChatroom, 'currentChatroom');
    	component_subscribe($$self, currentChatroom, $$value => $$invalidate(3, $currentChatroom = $$value));
    	validate_store(socket, 'socket');
    	component_subscribe($$self, socket, $$value => $$invalidate(11, $socket = $$value));
    	validate_store(currentUser, 'currentUser');
    	component_subscribe($$self, currentUser, $$value => $$invalidate(4, $currentUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Log', slots, []);
    	let loading = false;

    	//Toggle Chatroom Details Box
    	let showDetails = false;

    	const toggleDetails = () => {
    		const detailsArrows = document.getElementById('detailsArrows');
    		$$invalidate(1, showDetails = !showDetails);

    		showDetails
    		? detailsArrows.className = 'fas fa-angle-down'
    		: detailsArrows.className = 'fas fa-angle-up';
    	};

    	//Select Input Tab
    	let selectedTab = 'inputText';

    	const selectTab = e => {
    		$$invalidate(2, selectedTab = e.target.dataset.tab);
    	};

    	//Keep Messages scrolled At Bottom
    	history.scrollRestoration = 'manual';

    	const scrollToBottom = () => {
    		const scrollDiv = document.getElementById('scrollDiv');

    		setTimeout(
    			() => {
    				scrollDiv.scrollTop = scrollDiv.scrollHeight;
    			},
    			1
    		);
    	};

    	afterUpdate(() => {
    		scrollToBottom();
    	});

    	// Join Room
    	const joinRoom = e => {
    		e.preventDefault();
    		$$invalidate(0, loading = true);
    		const inputValue = e.target.joinRoom.value;
    		e.target.joinRoom.value = '';
    		if (inputValue === '') return;

    		const payload = {
    			userID: $currentUser._id,
    			chatroomID: inputValue
    		};

    		$socket.emit('chatroom:join', payload, response => {
    			if (response.user) {
    				set_store_value(currentUser, $currentUser = response.user, $currentUser);
    			}

    			if (response.chatroom) {
    				set_store_value(currentChatroom, $currentChatroom = response.chatroom, $currentChatroom);
    				console.log('%c Chatroom Joined', 'color:rgb(186, 104, 69);font-weight: bold;');
    				console.dir(response.chatroom);
    			}

    			$$invalidate(0, loading = false);
    		});
    	};

    	//Delete Chatroom
    	const deleteRoom = () => {
    		$socket.emit('chatroom:delete', { _id: $currentChatroom._id }, response => {
    			if (response.body) {
    				set_store_value(currentChatroom, $currentChatroom = response.body, $currentChatroom);
    				console.log(response.message);

    				$socket.emit('user:read', { _id: $currentUser._id }, response => {
    					set_store_value(currentUser, $currentUser = response, $currentUser);
    					console.log('%c User Recieved', 'color:rgb(61, 132, 153); font-weight: bold;');
    					console.dir(response);
    				});
    			}
    		});

    		$$invalidate(1, showDetails = false);
    	};

    	//Leave Chatroom
    	const leaveRoom = () => {
    		$socket.emit('chatroom:leave', {
    			userID: $currentUser._id,
    			chatroomID: $currentChatroom._id
    		});
    	};

    	// Parse Message
    	const parseMessage = async msg => {
    		const rgbRegex = /rgb\(\d+,\d+,\d+\)/g;
    		const imgRegex = /^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim;

    		if (msg.match(rgbRegex)) {
    			return { type: 'rgb' };
    		} else if (msg.match(imgRegex)) {
    			return { type: 'img' };
    		} else {
    			return { type: 'text' };
    		}
    	};

    	//Send Message
    	let saveState = true;

    	const sendMessage = async e => {
    		e.preventDefault();
    		const parsedMessage = await parseMessage(e.target.message.value);
    		console.log(parsedMessage.type);

    		const payload = {
    			target: $currentChatroom._id,
    			save: saveState,
    			message: {
    				senderID: $currentUser._id,
    				senderName: $currentUser.name,
    				color: $currentUser.color,
    				text: $currentUser.text,
    				type: parsedMessage.type,
    				msg: e.target.message.value,
    				timestamp: Date.now()
    			}
    		};

    		$socket.emit('chatroom:message', payload);
    		e.target.message.value = '';
    		$currentChatroom.messages.push(payload.message);
    		currentChatroom.set($currentChatroom);
    		scrollToBottom();
    		console.log('%c Message Sent: ', 'background-color:rgb(199, 176, 92); color:black; font-weight: bold;');
    		console.dir($currentUser);
    	};

    	//Get message
    	$socket.on('message', data => {
    		$currentChatroom.messages.push(data);
    		currentChatroom.set($currentChatroom);
    		scrollToBottom();
    		console.log('%c Message Recieved: ', 'color:rgb(199, 176, 92); font-weight: bold;');
    	}); // console.dir(data)

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Log> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		socket,
    		currentUser,
    		currentChatroom,
    		formatAMPM,
    		formatDate,
    		Message,
    		Loading,
    		DeleteButton,
    		RGB,
    		Keyboard,
    		Gamepad,
    		loading,
    		showDetails,
    		toggleDetails,
    		selectedTab,
    		selectTab,
    		scrollToBottom,
    		joinRoom,
    		deleteRoom,
    		leaveRoom,
    		parseMessage,
    		saveState,
    		sendMessage,
    		$currentChatroom,
    		$socket,
    		$currentUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('loading' in $$props) $$invalidate(0, loading = $$props.loading);
    		if ('showDetails' in $$props) $$invalidate(1, showDetails = $$props.showDetails);
    		if ('selectedTab' in $$props) $$invalidate(2, selectedTab = $$props.selectedTab);
    		if ('saveState' in $$props) saveState = $$props.saveState;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		loading,
    		showDetails,
    		selectedTab,
    		$currentChatroom,
    		$currentUser,
    		toggleDetails,
    		selectTab,
    		joinRoom,
    		deleteRoom,
    		leaveRoom,
    		sendMessage
    	];
    }

    class Log extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Log",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\Chat\Chatroom.svelte generated by Svelte v3.55.1 */

    const file$1 = "src\\components\\Chat\\Chatroom.svelte";

    // (17:0) {:else}
    function create_else_block$1(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(17:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:0) {#if $currentUser._id}
    function create_if_block$1(ctx) {
    	let div1;
    	let div0;
    	let usersidebar;
    	let t;
    	let log;
    	let current;
    	usersidebar = new UserSidebar({ $$inline: true });
    	log = new Log({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(usersidebar.$$.fragment);
    			t = space();
    			create_component(log.$$.fragment);
    			attr_dev(div0, "class", "center-container svelte-154coke");
    			add_location(div0, file$1, 11, 4, 282);
    			attr_dev(div1, "class", "chatroom svelte-154coke");
    			add_location(div1, file$1, 10, 2, 254);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(usersidebar, div0, null);
    			append_dev(div0, t);
    			mount_component(log, div0, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usersidebar.$$.fragment, local);
    			transition_in(log.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usersidebar.$$.fragment, local);
    			transition_out(log.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(usersidebar);
    			destroy_component(log);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(10:0) {#if $currentUser._id}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$currentUser*/ ctx[0]._id) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $currentUser;
    	validate_store(currentUser, 'currentUser');
    	component_subscribe($$self, currentUser, $$value => $$invalidate(0, $currentUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chatroom', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chatroom> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Login,
    		UserSidebar,
    		Log,
    		currentUser,
    		$currentUser
    	});

    	return [$currentUser];
    }

    class Chatroom extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chatroom",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.55.1 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (49:2) {#if modalContent}
    function create_if_block_5(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(49:2) {#if modalContent}",
    		ctx
    	});

    	return block;
    }

    // (50:4) <Modal>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*modalContent*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(50:4) <Modal>",
    		ctx
    	});

    	return block;
    }

    // (65:4) {:else}
    function create_else_block(ctx) {
    	let h1;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Page Not Found";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Go Home";
    			add_location(h1, file, 65, 6, 1838);
    			add_location(button, file, 66, 6, 1868);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(65:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:34) 
    function create_if_block_4(ctx) {
    	let profile;
    	let current;
    	profile = new Profile({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(profile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(profile, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(profile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(profile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(profile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(63:34) ",
    		ctx
    	});

    	return block;
    }

    // (61:31) 
    function create_if_block_3(ctx) {
    	let chatroom;
    	let current;
    	chatroom = new Chatroom({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(chatroom.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chatroom, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chatroom.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chatroom.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chatroom, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(61:31) ",
    		ctx
    	});

    	return block;
    }

    // (59:32) 
    function create_if_block_2(ctx) {
    	let morsedecoder;
    	let current;

    	morsedecoder = new MorseDecoder({
    			props: { props: { full: true } },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(morsedecoder.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(morsedecoder, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(morsedecoder.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(morsedecoder.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(morsedecoder, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(59:32) ",
    		ctx
    	});

    	return block;
    }

    // (57:32) 
    function create_if_block_1(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(57:32) ",
    		ctx
    	});

    	return block;
    }

    // (55:4) {#if $page === 'home'}
    function create_if_block(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(55:4) {#if $page === 'home'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let t0;
    	let header;
    	let t1;
    	let div;
    	let current_block_type_index;
    	let if_block1;
    	let current;
    	let if_block0 = /*modalContent*/ ctx[1] && create_if_block_5(ctx);
    	header = new Header({ $$inline: true });

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4,
    		create_else_block
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$page*/ ctx[0] === 'home') return 0;
    		if (/*$page*/ ctx[0] === 'login') return 1;
    		if (/*$page*/ ctx[0] === 'morse') return 2;
    		if (/*$page*/ ctx[0] === 'chat') return 3;
    		if (/*$page*/ ctx[0] === 'profile') return 4;
    		return 5;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			div = element("div");
    			if_block1.c();
    			attr_dev(div, "class", "container svelte-3nzbdt");
    			add_location(div, file, 53, 2, 1522);
    			add_location(main, file, 47, 0, 1436);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t0);
    			mount_component(header, main, null);
    			append_dev(main, t1);
    			append_dev(main, div);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*modalContent*/ ctx[1]) if_block0.p(ctx, dirty);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			destroy_component(header);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $socketStatus;
    	let $socket;
    	let $currentUser;
    	let $page;
    	validate_store(socketStatus, 'socketStatus');
    	component_subscribe($$self, socketStatus, $$value => $$invalidate(3, $socketStatus = $$value));
    	validate_store(socket, 'socket');
    	component_subscribe($$self, socket, $$value => $$invalidate(4, $socket = $$value));
    	validate_store(currentUser, 'currentUser');
    	component_subscribe($$self, currentUser, $$value => $$invalidate(5, $currentUser = $$value));
    	validate_store(page, 'page');
    	component_subscribe($$self, page, $$value => $$invalidate(0, $page = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let modalContent = null;

    	onMount(() => {
    		if (localStorage.getItem('currentUser')) {
    			set_store_value(currentUser, $currentUser = JSON.parse(localStorage.getItem('currentUser')), $currentUser);

    			$socket.emit('user:read', { _id: $currentUser._id }, response => {
    				set_store_value(currentUser, $currentUser = response, $currentUser);
    				console.log(`Auto Login`);
    			}); //console.dir(response)
    		}
    	});

    	console.log('Raspberry pi autopulled from github! Woo');

    	//Socket.io
    	$socket.on('connect', () => {
    		set_store_value(socketStatus, $socketStatus = 1, $socketStatus);
    		console.log(`%cConnected: ${$socket.id}`, 'background-color:rgb(63, 153, 82); padding: 2px 15px; border-radius: 10px;font-weight: bold;');
    	});

    	$socket.on('disconnect', () => {
    		set_store_value(socketStatus, $socketStatus = 0, $socketStatus);
    		console.log(`%cDisconnected`, 'background-color:rgb(197, 69, 69); padding: 2px 15px; border-radius: 10px;font-weight: bold;'); // undefined
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		set_store_value(page, $page = 'home', $page);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Header,
    		Modal,
    		Home,
    		Login,
    		Profile,
    		MorseDecoder,
    		Chatroom,
    		page,
    		socket,
    		socketStatus,
    		currentUser,
    		modalContent,
    		$socketStatus,
    		$socket,
    		$currentUser,
    		$page
    	});

    	$$self.$inject_state = $$props => {
    		if ('modalContent' in $$props) $$invalidate(1, modalContent = $$props.modalContent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$page, modalContent, click_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
