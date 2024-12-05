import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)
    
    if (getNewColumn) {
      //xu ly cau truc data truoc khi tra dl ve
      getNewColumn.cards = []
      //Cap nhat mang columnids
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)    
    return updatedColumn
  } catch (error) {
    throw new Error(error)
  }
}

export const columnService = {
  createNew, update
}
