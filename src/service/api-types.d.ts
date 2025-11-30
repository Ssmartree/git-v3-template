// cSpell:disable
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
}
interface Permission {
  query: boolean
  add: boolean
  delete: boolean
  modify: boolean
  importFlag: boolean
  export: boolean
}

interface DnnProject {
  int_id: number
  project_name: string
  upf_name: string
  dnn: string
  city_name: string
  business_types: string
  dnn_types: string
  slice_id: string
  application_description: string
  is_wireless: string
  wireless_deploy_scale: string
  entirety_cover_mode: string
  cover_target: string
  is_3partgnb: string
  gnb_id: string
  gnb_name: string
  aname: string
  aip: string
  aportname: string
  b1_nehostname: string
  b1_ip: string
  b1_port: string
  b2_nehostname: string
  b2_ip: string
  b2_port: string
  ipv4_primarydnsaddress: string
  ipv4_alternatednsaddress: string
  ipv6_primarydnsaddress: string
  ipv6_alternatednsaddress: string
  is_fixedip: string
  terminal_mutualaccess: string
  uplinkrate_require: string
  downlinkrate_require: string
  delay_require: string
  datasecurity_require: string
  business_require: string
  is_mec: string
  mec_deploy_desc: string
  approved_ornot: string
  modify_suggest: string
  apply_reason: string
  update_time: number
  created_by: string
  city: string
  rollout_report: string
  rollout_update_time: number
}
type DnnProjects = Nullable<DnnProject>[]

interface PopApp {
  TIMEVALUE: string
  SCENE_CATEGORIES: string
  SCENE_SUBCLASS: string
  ACCESSNET_TYPE: string
  TYPE: string
  OCTETS: string
  VISI_CNT: string
  OCTETS_RAT: string
  VISI_RAT: string
  DAY: string
  MINUTE: string
  ROW_NUM: number
}
type PopApps = Nullable<PopApp>[]

interface AAA {
  // name: string
  num: number
}
interface BBB {
  name: string
}
type C = AAA & BBB
const c1: C = {

}
