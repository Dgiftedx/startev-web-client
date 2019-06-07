 export class Message {
      constructor(
       public id : number,
       public sender_id: number, 
       public receiver_id: number, 
       public conversation_id: number,
       public messaging_group_id: number, 
       public message: string,
       public file: string,
       public type: string,
       public last_read: Date,
       public status: string,
       public created_at: Date,
       public updated_at: Date) {
        this.id = id;
        this.sender_id  = sender_id;
        this.receiver_id = receiver_id;
        this.conversation_id = conversation_id;
        this.messaging_group_id = messaging_group_id;
        this.message = message;
        this.file = file;
        this.type = type;
        this.last_read = last_read;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
      }
    }