export type GameLine = {
  number: number,
  whiteMove: string,
  blackMove: string,
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

export const orderMoves = (array: Array<string>): GameLines => {
  let lineNumber = 1;

  let orderedMoves = Array.from(array, (value, index) => {
    const line = {
      number: 0,
      whiteMove: '',
      blackMove: '',
    };

    if (index % 2 === 0 || index === 0) {
      line.number = lineNumber;
      line.whiteMove = array[index];
      if (array[index + 1] !== undefined) {
        line.blackMove = array[index + 1];
      }

      lineNumber += 1;

      return line;
    }

    return null;
  });

  orderedMoves = orderedMoves.filter((n) => n);

  return orderedMoves.reverse();
};
