const findFigure = (str: string): string => {
  const figuresMapping = {
    K: 'king',
    Q: 'queen',
    R: 'rook',
    B: 'bishop',
    N: 'knight',
  };

  let figure = '';

  Object.entries(figuresMapping).forEach((entry) => {
    const [key, value] = entry;
    if (str.includes(key)) {
      figure = value;
    }
  });

  return figure;
};

export type GameLine = {
  number: number,
  whiteMove: string,
  whitePiece: string,
  blackMove: string,
  blackPiece: string,
  lastMove: string,
} | null;

export type GameLines = Array<GameLine>;

export const readStream = (processLine: any) => (response: any) => {
  const stream = response.body.getReader();
  const matcher = /\r?\n/;
  const decoder = new TextDecoder();
  let buf = '';

  const loop = () => {
    stream.read().then(({ done, value }: any) => {
      if (done) {
        if (buf.length > 0) processLine(JSON.parse(buf));
      } else {
        const chunk = decoder.decode(value, {
          stream: true,
        });
        buf += chunk;

        const parts = buf.split(matcher);
        buf = parts.pop() ?? '';

        // eslint-disable-next-line no-restricted-syntax
        for (const i of parts.filter((p) => p)) processLine(JSON.parse(i));

        return loop();
      }

      return true;
    });
  };

  return loop();
};

export const orderMoves = (history: Array<string>): GameLines => {
  let lineNumber = 1;

  let orderedMoves = Array.from(history, (value, index) => {
    const line = {
      number: 0,
      whiteMove: '',
      whitePiece: '',
      blackMove: '',
      blackPiece: '',
      lastMove: '',
    };

    if (index % 2 === 0 || index === 0) {
      if (history.length === (index + 1)) {
        line.lastMove = 'white';
      }
      if (
        history[index + 1] !== undefined
        && history.length === (index + 2)
      ) {
        line.lastMove = 'black';
      }

      line.number = lineNumber;
      line.whiteMove = history[index];
      line.whitePiece = findFigure(line.whiteMove);

      if (history[index + 1] !== undefined) {
        line.blackMove = history[index + 1];
        line.blackPiece = findFigure(line.blackMove);
      }

      lineNumber += 1;

      return line;
    }

    return null;
  });

  orderedMoves = orderedMoves.filter((n) => n);

  return orderedMoves.reverse();
};
