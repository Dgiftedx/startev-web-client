 export class Feed {
      constructor(
        public roleData: any,
        public user: any,
        public postType: string,
        public title: string,
        public content: string,
        public createdAt: Date
      ) {
        this.roleData = roleData; 
        this.user = user;
        this.postType = postType;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
      }
    }