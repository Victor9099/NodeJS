import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdBoard = await boardModel.createNew(newBoard)
    // console.log('check: ', createdBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // console.log(getNewBoard)
    return getNewBoard
  } catch (error) {
    throw new Error(error)
  }
}
const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    //Tao ra ban moi khong anh huong den board ban dau
    const resBoard = cloneDeep(board)
    // Convert object id ve to string
    // resBoard.columns.forEach((column) => {
    //   column.cards = resBoard.cards.filter(
    //     (card) => card.columnId.toString() === column._id.toString()
    //   )
    // })
    //Xu ly mongodb cho mang card va column song song
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter(
        (card) => card.columnId.equals(column._id)
      )
    })
    //Xoa mang card nam song song vs column
    delete resBoard.cards
    return resBoard
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)    
    return updatedBoard
  } catch (error) {
    throw new Error(error)
  }
}
const moveCardToDifferentColumn = async (reqBody) => {
  try {
    //Cap nhat mang column ban dau chua caed
    await columnModel.update(reqBody.prevColumnID, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })
    await columnModel.update(reqBody.nextColumnID, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    await cardModel.update(reqBody.currentCardId,{
      columnId: reqBody.nextColumnId
    })

    return {updatedResult: 'Successfully'}
  } catch (error) {
    throw new Error(error)
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}
