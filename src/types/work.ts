type Work = {
  id: string,
  device_name: string,
  device_types: {type: string},
  owning_entity: string,
  executing_entity: string,
  date_of_arrival:string,
  date_of_delivery: string,
  status: string,
  cost: number,
  attachments: string[],
  notes: string,
  phone_number: string,
  device_password: string,
  system_version: string,
  created_at: string,
  updated_at: string
}


export { type Work }