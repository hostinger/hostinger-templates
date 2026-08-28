import boatHouse from '~/assets/images/boat-house.jpg'
import lookout from '~/assets/images/lookout.jpg'
import saltStore from '~/assets/images/salt-store.jpg'

const roomImages: Record<string, string> = {
  lookout,
  'boat-house': boatHouse,
  'salt-store': saltStore,
}

export const getRoomImage = (slug: string) => roomImages[slug] ?? lookout
