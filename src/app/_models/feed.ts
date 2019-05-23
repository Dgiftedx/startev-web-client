 export class Feed {
      constructor(
        public id : number,
        public roleData: any,
        public user: any,
        public postType: string,
        public title: string,
        public content: string,
        public image: string,
        public video: string,
        public link: any,
        public likers: any,
        public comments:any,
        public hasLiked: boolean,
        public createdAt: Date
      ) {
        this.id = id;
        this.roleData = roleData; 
        this.user = user;
        this.postType = postType;
        this.title = title;
        this.content = content;
        this.image = image;
        this.video = video;
        this.link = link;
        this.likers = likers;
        this.comments = comments;
        this.hasLiked = hasLiked;
        this.createdAt = createdAt;
      }
    }