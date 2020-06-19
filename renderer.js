class Tag {
    constructor(name, content, attributes) {
        this.name = name;
        this.content = content;
        this.attributes = attributes;
    }

    buildOpening() {
        let opening = `<${this.name}`;
        this.attributes.forEach((value, key) => opening += ` ${key}="${value}"`);
        return opening + '>';
    }

    buildContent() {
        return this.content !== undefined ? this.content : '';
    }

    buildClosing() {
        return `</${this.name}>`;
    }

    toString() {
        return `${this.buildOpening()}${this.buildContent()}${this.buildClosing()}`;
    }
}

function renderer() {
    let tagName = 'div';
    const attributes = new Map();

    function block(content) {
        let tag = new Tag(tagName, content, attributes);
        return tag.toString();
    }

    block.element = function (newTag) {
        if (newTag !== undefined) {
            tagName = newTag;
            return this;
        }
        return tagName;
    }

    block.attr = function (key, value) {
        if (value !== undefined) {
            attributes.set(key, value);
            return block;
        }
        return attributes.get(key);
    }

    return block;
}

// Testing function
let div = renderer();

// Level 1
console.log('div', div.element());
console.log('<div></div>', div());

// Level 2
const p = renderer();
p.element('p');
console.log('p', p.element());
console.log('<p></p>', p());

// Level 3
console.log('<p>Text</p>', p('Text'));

// Level 4
console.log('<p>Another text</p>', renderer().element('p')('Another text'));

// Level 5, optional
const body = renderer()
    .element('body')
    .attr('style', 'background: yellow')
    .attr('class', 'body');

console.log('background: yellow', body.attr('style'));
console.log(
    '<body style="background: yellow" class="body"><p>Text</p></body>',
    body(p('Text'))
);
