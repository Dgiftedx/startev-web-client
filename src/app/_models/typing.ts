 export class Typing {
      constructor(
        public sender_id: number,
        public receiver_id: number,
        public message: string,
        public isTyping:boolean,

      ) {
        this.sender_id = sender_id;
        this.receiver_id = receiver_id;
        this.message = message;
        this.isTyping = isTyping;
      }
    }