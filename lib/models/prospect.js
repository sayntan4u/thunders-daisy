class Prospect {
  constructor({
    id,
    name,
    week,
    zone,
    city = "",
    chatting = false,
    socialMedia = false,
    stage1=false,
    stage1Week = "",
    stage2=false,
    stage2Week = "",
    info = false,
    infoWeek = "",
    infoResponse = "",
    reinfo = false,
    reinfoWeek = "",
    reinfoResponse = "",
    meetup = false,
    invi = false,
    inviWeek = "",
    inviResponse = "",
    plan = false,
    planWeek = "",
    planStatus = "",
    remarks = "",
  }) {
    this.id = id;
    this.name = name;
    this.week = week;
    this.zone = zone;
    this.city = city;
    this.chatting = chatting;
    this.socialMedia = socialMedia;
    this.stage1 = stage1;
    this.stage1Week = stage1Week;
    this.stage2 = stage2;
    this.stage2Week = stage2Week;
    this.info = info;
    this.infoWeek = infoWeek;
    this.infoResponse = infoResponse;
    this.reinfo = reinfo;
    this.reinfoWeek = reinfoWeek;
    this.reinfoResponse = reinfoResponse;
    this.meetup = meetup;
    this.invi = invi;
    this.inviWeek = inviWeek;
    this.inviResponse = inviResponse;
    this.plan = plan;
    this.planWeek = planWeek;
    this.planStatus = planStatus;
    this.remarks = remarks;
  }
}


  module.exports = {Prospect};