 export class BroadcastMessage {
      constructor(
        public id : number,
        public schedule_id : number,
        public user_avatar: string,
        public user_name : string,
        public message:string,
        public is_mentor: boolean,
        public created_at: Date
      ) {
        this.id = id;
        this.schedule_id = schedule_id,
        this.user_avatar = user_avatar;
        this.user_name = user_name;
        this.message = message;
        this.is_mentor = is_mentor;
        this.created_at = created_at;
      }
    }