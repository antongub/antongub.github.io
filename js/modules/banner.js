/**
 * Fills content of an HTMLElememt with ascii characters.
 */
class AsciiBucket {
  #characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  #textWidth = 0;
  #textHeight = 0;
  #elementWidth = 0;
  #elementHeight = 0;
  #element;


  // single char which will be ignored for {overlappingTexts}. Ignore means that random strings are used instead.
  #overlappingIgnoreChar = "x";
  // Text that overlaps on the #element. Is displayed in the center.
  #overlappingTexts = [
    String.raw`xxxx _ xxxxxxxx _ xxxxxxxxxxxxxx`,
    String.raw`xxx / \   _ __ | |_ ___  _ __ xx`,
    String.raw`xx / _ \ | '_ \| __/ _ \| '_ \ x`,
    String.raw`x / ___ \| | | | || (_) | | | | `,
    String.raw` /_/ x \_\_| |_|\__\___/|_| |_| `,
  ];


  /**
   * Creates a string of random characters, based on {#characters}.
   * @param {number} length                   length of the output string
   * @returns {string}                        randomized string
   */
  #createString(length) {
    let result = '';
    const charactersLength = this.#characters.length;
    let counter = 0;
    while (counter < length) {
      result += this.#characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }


  /**
   * Creates a string of random characters.
   * The String is returned in the length of the elements width.
   * @returns {string}                        randomized string
   */
  #createRowString() {
    let content = "";
    for (let posX = 0; posX < this.#elementWidth; posX += this.#textWidth) {
      content += this.#createString(1);
    }
    return content;
  }


  /**
   * Creates a string of random characters.
   * The String is returned in the length of the elements width.
   * The String contains centered a specific index of {overlappingTexts}.
   * @param {number} overlappingTextsIndex    specifc index of {overlappingTexts} which is part of the result
   * @returns {string}                        randomized string
   */
  #createRowStringWithOverlappingText(overlappingTextsIndex) {
    const overlappingText = this.#overlappingTexts[overlappingTextsIndex];
    const overlappingTextLength = overlappingText.length;

    // Count of characters that fits in a row.
    const allCharsLength = Math.ceil(this.#elementWidth / this.#textWidth);
    // Start position of the {overlappingText} according to the {content} index (X-Position).
    const overlappingTextStart = Math.floor((allCharsLength / 2) - (overlappingTextLength / 2));
    // End position of the {overlappingText} according to the {content} index (X-Position).
    const overlappingTextEnd = Math.floor((allCharsLength / 2) + (overlappingTextLength / 2));
    // Iterable index of the {overlappingText} string that is used to insert text char by char.
    let overlappingCharIndex = 0;

    let content = "";
    for (let posX = 0; posX < this.#elementWidth; posX += this.#textWidth) {
      // Char index according to the {content} string.
      const currentIndex = Math.round(posX / this.#textWidth);

      // Determine If {currentIndex} is between overlappingText -Start and -End.
      if (currentIndex >= overlappingTextStart && currentIndex < overlappingTextEnd) {

        const overlappingChar = overlappingText[overlappingCharIndex];
        if (overlappingChar == this.#overlappingIgnoreChar) {
          content += this.#createString(1);
        } else {
          content += overlappingText[overlappingCharIndex];
        }
        overlappingCharIndex++;
      } else {
        content += this.#createString(1);
      }
    }
    return content;
  }


  /**
   * *Adds* multiple Rows of random character strings inside the HTMLElement {#element}.
   * OverlappingText is considered in those strings.
   * @returns {void}
   */
  #fillElement() {
    const overlappingTextArrayLength = this.#overlappingTexts.length;
    const allRowsLength = Math.ceil(this.#elementHeight / this.#textHeight);
    // Start position of {overlappingTexts} according to the Rows (Y-Position).
    const overlappingRowStart = Math.floor((allRowsLength / 2) - (overlappingTextArrayLength / 2));
    // End position of {overlappingTexts} according to the Rows (Y-Position).
    const overlappingRowEnd = Math.floor((allRowsLength / 2) + (overlappingTextArrayLength / 2));
    // Iterable count that is used to insert {overlappingText} row by row.
    let overlappingLineCount = 0;

    // Fill Element:
    for (let posY = 0; posY < this.#elementHeight; posY += this.#textHeight) {
      // Get current row.
      const currentRow = Math.round(posY / this.#textHeight);
      // Check if {currentRow} is between overlappingRow -Start and -End.
      if (currentRow >= overlappingRowStart && currentRow < overlappingRowEnd) {
        // Create custom (overlappingtext) row.
        this.#element.innerHTML += this.#createRowStringWithOverlappingText(overlappingLineCount) + "\n";
        overlappingLineCount++;
      } else {
        // Create normal row.
        this.#element.innerHTML += this.#createRowString() + "\n";
      }
    }

  }


  /**
   * Changes content of HTMLElement {#element} and edits Rows to contain different character random strings.
   * OverlappingText is considered in those strings.
   * @returns {void}
   */
  changeContent() {
    const overlappingTextArrayLength = this.#overlappingTexts.length;
    let allRowsArray = this.#element.innerHTML.split("\n");

    const allRowsLength = allRowsArray.length - 1; // Minus 1 because the last entry is empty.
    // Start position of {overlappingTexts} according to the Rows (Y-Position).
    const overlappingRowStart = Math.floor((allRowsLength / 2) - (overlappingTextArrayLength / 2));
    // End position of {overlappingTexts} according to the Rows (Y-Position).
    const overlappingRowEnd = Math.floor((allRowsLength / 2) + (overlappingTextArrayLength / 2));
    // Iterable count that is used to insert {overlappingText} row by row.
    let overlappingLineCount = -1;

    allRowsArray = allRowsArray.map((it, index) => {
      if (it == "") {
        return "";
      }

      // Check if {index} is between overlappingRow -Start and -End.
      if (index >= overlappingRowStart && index < overlappingRowEnd) {
        overlappingLineCount++;
        // Create custom (overlappingtext) row.
        return this.#createRowStringWithOverlappingText(overlappingLineCount);
      } else {
        // Create normal row.
        return this.#createRowString();
      }
    })
    this.#element.innerHTML = allRowsArray.join("\n");
  }


  constructor(element) {
    const lineHeight = 1.2;
    element.style.whiteSpace = "pre";

    this.#elementWidth = element.offsetWidth;
    this.#elementHeight = element.offsetHeight;
    this.#element = element;
    this.#element.style.lineHeight = lineHeight;

    // Calcuale single character width and height.
    const tmp = document.createElement("span");
    tmp.style.width = "1ch";
    tmp.style.height = "1ch";
    tmp.style.position = "fixed";
    this.#element.appendChild(tmp);
    this.#textWidth = tmp.getBoundingClientRect().width;
    const fontSize = window.getComputedStyle(tmp).fontSize;
    this.#textHeight = parseInt(fontSize.slice(0, fontSize.length - 2)); //Slice last two characters: "px".
    this.#textHeight = this.#textHeight * lineHeight;
    this.#element.removeChild(tmp);


    this.#fillElement();
  }
}

export { AsciiBucket };
