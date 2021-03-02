const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean
} = require('graphql')

const telegramBot = require('../lib/telegram')

const { GraphQLEmail, GraphQLDateTime } = require('graphql-custom-types')
const moment = require('moment')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const pubsub = require('../lib/pubsub')

const Username = require('./Username')
const orderStatus = require('../constants/orderStatus')

const ActionInfo = require('./ActionInfo')
const AddProductInput = require('./AddProductInput')
const CollectionInput = require('./CollectionInput')
const CollectionModel = require('../database/models/Collection')
const RecipeModel = require('../database/models/Recipe')
const ActionOnCollectionPayload = require('./ActionOnCollectionPayload')
const ActionOnRecipePayload = require('./ActionOnRecipePayload')
const OffDayModel = require('../database/models/OffDay')
const ActionOnOffDayPayload = require('./ActionOnOffDayPayload')
const ProductModel = require('../database/models/Product')
const CartModel = require('../database/models/Cart')
const CategoryModel = require('../database/models/Category')
const OrderModel = require('../database/models/Order')
const EmailVerificationModel = require('../database/models/EmailVerification')
const { bulkUpload, singleUpload } = require('../utils/upload')
const ActionOnDeliveryAddressPayload = require('./ActionOnDeliveryAddressPayload')
const DeliveryAddressInput = require('./DeliveryAddressInput')
const ActionOnUserPayload = require('./ActionOnUserPayload')
const SendEmailVerificationCodePayload = require('./SendEmailVerificationCodePayload')
const PaymentMethodInput = require('./PaymentMethodInput')
const RegisterInput = require('./RegisterInput')
const UserModel = require('../database/models/User')
const userType = require('../constants/userType')
const hashPassword = require('../utils/hashPassword')
const PlaceOrderInput = require('./PlaceOrderInput')
const PlaceOrderPayload = require('./PlaceOrderPayload')
const OrderStatusEnum = require('./OrderStatusEnum')
const ActionOnOrderPayload = require('./ActionOnOrderPayload')
const ActionOnProductPayload = require('./ActionOnProductPayload')
const ProductInput = require('./ProductInput')
const ActionOnAppConfigPayload = require('./ActionOnAppConfigPayload')
const AppConfigInput = require('./AppConfigInput')
const RecipeInput = require('./RecipeInput')
const NotificationModel = require('../database/models/Notification')
const CollectionTypeEnum = require('./CollectionTypeEnum')
const BannerInput = require('./BannerInput')
const LinkInput = require('./LinkInput')

const UpdateCartItemPayload = require('./UpdateCartItemPayload')
const CategoryInput = require('./CategoryInput')
const ActionOnCategoryPayload = require('./ActionOnCategoryPayload')
const isValidUsername = require('../utils/isValidUsername')
const AppConfigModel = require('../database/models/AppConfig')
const isTodayBetween = require('../utils/isTodayBetween')

const UnitLoader = require('../dataloader/UnitLoader')
const ProductLoader = require('../dataloader/ProductLoader')
const AppConfigLoader = require('../dataloader/AppConfigLoader')
const ServiceAvailabilityLoader = require('../dataloader/ServiceAvailabilityLoader')

module.exports = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createNotification: {
      type: GraphQLBoolean,
      args: {
        productId: { type: new GraphQLNonNull(GraphQLString) },
        to: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
        text: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { productId, to, text, title }) => {
        const product = await ProductModel.findById(mongoose.Types.ObjectId(productId))
        if(product) {
          const productImage = product.images.find(image => image.display === 1)
          text = `*${product.name}* sedang diskon.`
          const notificationObj = {
            title,
            text,
            to: [mongoose.Types.ObjectId(to)],
            images: [productImage],
            screen: 'ProductDetails',
            screenParams: [
              { key: 'id', value: productId }
            ]
          }

          const newNotification = new NotificationModel(notificationObj)
          const notification = await newNotification.save()
          pubsub.publish('NEW_NOTIFICATION', notification)
          return true
        }
      },
    },
    hashPassword: {
      type: GraphQLString,
      args: {
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { password }) => await hashPassword(password)
    },
    sendTelegramMessage: {
      type: GraphQLString,
      args: {
        chatId: { type: new GraphQLNonNull(GraphQLString) },
        message: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { chatId, message }) => {
        telegramBot.sendMessage(998703948, message)
      }
    },
    addOffDay: {
      type: ActionOnOffDayPayload,
      args: {
        date: { type: new GraphQLNonNull(GraphQLDateTime) }
      },
      resolve: async (_, { date }, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) {
          const _id = moment(date).format('DD/MM/YYYY')
          await OffDayModel.update({ _id }, { date }, { upsert: true })
          return {
            actionInfo: {
              hasError: false,
              message: ''
            }
          }
        }
      }
    },
    deleteOffDay: {
      type: ActionOnOffDayPayload,
      args: {
        date: { type: new GraphQLNonNull(GraphQLDateTime) }
      },
      resolve: async (_, { date }, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) {
          const _id = moment(date).format('DD/MM/YYYY')
          await OffDayModel.deleteOne({ _id })
          return {
            actionInfo: {
              hasError: false,
              message: ''
            }
          }
        }
      }
    },
    usernameValid: {
      type: GraphQLBoolean,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { username }) => {
      //  const regexp = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm
      //  return username.search(regexp) !== -1
      //  const regexp = /^(?=.{4,30}$)(?![_.])(?!.*[_.]{2})[a-z0-9._]+(?<![_.])$/
      //  return regexp.test(username)
        return isValidUsername(username)
      }
    },
    createProduct: {
      type: ActionOnProductPayload,
      args: {
        input: { type: new GraphQLNonNull(ProductInput) }
      },
      resolve: async (_, { input }, ctx, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) {
          const userId = mongoose.Types.ObjectId(user.id)
          const { req } = ctx
          const { files } = req

      //   const images = await bulkUpload(files)
          const newProduct = new ProductModel({
            lastUpdatedBy: userId,
            ...input,
          /*  images: images.map((image, i) => ({
              ...image,
              display: i === 0 ? 1 : 0
            }))*/
            images: []
          })
          console.log(newProduct)
        //  const saveResult = await newProduct.save()*/
    
          return {
            actionInfo: {
              hasError: false,
              message: 'Product has been added'
            },
            product: newProduct
          }
        }
      }
    },
    updateProduct: {
      type: ActionOnProductPayload,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(ProductInput) }
      },
      resolve: async (_, { id, input }, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) {
          const userId = mongoose.Types.ObjectId(user.id)
          const product = await ProductModel.findByIdAndUpdate(
            mongoose.Types.ObjectId(id),
            {
              ...input,
              lastUpdatedBy: userId
            },
            { new: true }
          )
  
          return {
            actionInfo: {
              hasError: false,
              message: 'Product has been updated'
            },
            product
          }
        }
        
      }
    },
    register: {
      type: GraphQLString,
      args: {
        input: { type: new GraphQLNonNull(RegisterInput) }
      },
      resolve: async (_, { input }) => {
        const newUser = new UserModel({ 
          ...input,
          loginIds: [input.loginId, input.username],
          userType: userType.CUSTOMER,
          password: await hashPassword(input.password)
        })

        const saveResult = await newUser.save()
        return 'Registered succesfully'
      }
    },
    login: {
      type: ActionOnUserPayload,
      args: {
        loginId: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { loginId, password }, { session }) => {
        const user = await UserModel.findOne({ loginIds: loginId })
        if(user) {
          if(await bcrypt.compare(password, user.password)) {
            session.user = { 
              id: user._id.toString(),
              userType: user.userType
            }
            return {
              actionInfo: {
                hasError: false,
                message: user.userType === userType.COURIER ? 'Welcome to Courier account' : 'You have successfully logged in'
              },
              user
            }
          } else {
            return {
              actionInfo: {
                hasError: true,
                message: 'Invalid password'
              },
            }
          }
        } else { 
          return {
            actionInfo: {
              hasError: true,
              message: 'User not found'
            },
          }
          
        }
          
      }
    },
    logout: {
      type: ActionInfo,
      resolve: (_, __, { session }) => {
        delete session.user
        return {
          hasError: false
        }
      }
    },
    updateCartItem: {
      type: UpdateCartItemPayload,
      args: {
        productId: { type: new GraphQLNonNull(GraphQLString) },
        qty: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: async (_, { productId, qty }, { session }) => {
        if(session.cartId) {
          const cartId = mongoose.Types.ObjectId(session.cartId)
          
          return new Promise((resolve, reject) => {
            CartModel.findOne({ cartId }, async (err, doc) => {
              if(err)
                console.log(err)
              else {
                if(doc) {
                  // remove the product
                  doc.items = doc.items.filter(item => 
                    !item.productId.equals(mongoose.Types.ObjectId(productId))
                  )
  
                  if(qty > 0) {
                    // update qty
                    doc.items.push({ productId, qty })
                  }
                  
                  const newCart = await doc.save()

                  resolve({
                    cart: newCart
                  })
  
                } else {
                  if(qty > 0) {
                    const newCart = new CartModel({
                      cartId,
                      items: [{
                        productId,
                        qty
                      }]
                    })
    
                    const savedCart = await newCart.save()

                    resolve({
                      cart: savedCart
                    })
                  } else {
                    resolve({
                      cart: {
                        cartId,
                        items: [],
                        updatedAt: new Date()
                      }
                    })
                  }
                }
              }
            })
          })
          
        } else {
          
          if(qty > 0) {
            const cartId = mongoose.Types.ObjectId()
            session.cartId = cartId.toString()

            const newCart = new CartModel({
              cartId,
              items: [{
                productId,
                qty
              }]
            })

            const savedCart = await newCart.save()

            return {
              cart: savedCart
            }
          }

          return {
            cart: {
              cartId: mongoose.Types.ObjectId().toString(),
              items: [],
              updatedAt: new Date()
            }
          }
        }
      }
    },

    updateCategory: {
      type: new GraphQLNonNull(ActionOnCategoryPayload),
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(CategoryInput) }
      },
      resolve: async (_, { id, input }, { req }) => {
        const { files } = req
        console.log(files)
        if(files && files[0])
          input.icon = await singleUpload(files[0])

        const category = await CategoryModel.findByIdAndUpdate(
          mongoose.Types.ObjectId(id),
          input,
          { new: true, useFindAndModify: false }
        )

        return {
          actionInfo: {
            hasError: false,
            message: 'Category has been updated'
          },
          category
        }
      }
    },

    updateAppConfig: {
      type: new GraphQLNonNull(ActionOnAppConfigPayload),
      args: {
        input: { type: new GraphQLNonNull(AppConfigInput) }
      },
      resolve: async (_, { input }, { session: { user }}) => {
        if(user?.userType === userType.ADMIN) {
          const userId = mongoose.Types.ObjectId(user.id)
          const appConfig = await AppConfigModel.findByIdAndUpdate(
            'buku_masak',
            {
              ...input,
              lastUpdatedBy: userId
            },
            { new: true, useFindAndModify: false }
          )
  
          return {
            actionInfo: {
              hasError: false,
              message: 'Setting has been updated'
            },
            appConfig
          }
        }
      }
    },

    updateOrderStatus: {
      type: ActionOnOrderPayload,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(OrderStatusEnum) }
      },
      resolve: async (_, { id, status }, { session: { user }}) => {
        const orderId = mongoose.Types.ObjectId(id)
        if(
          user?.userType === userType.COURIER && 
          status === orderStatus.COMPLETED
        ) {
          const userId = mongoose.Types.ObjectId(user.id)
          return new Promise(resolve => {
            OrderModel.findById(orderId, async (err, doc) => {
              if(err) {
                console.log(err)
              } else if(doc) {
                doc.status = status
                doc.lastUpdatedBy = userId
                doc.completedBy = userId

                resolve({
                  actionInfo: {
                    hasError: false,
                    message: `Order has been completed`
                  },
                  order: await doc.save()
                })
              }
            })
          })
          
        } else if(
            user?.userType === userType.CUSTOMER && 
            (status === orderStatus.CANCELLED || status === orderStatus.DELETED)
          ) {
          const userId = mongoose.Types.ObjectId(user.id)
          return new Promise(resolve => {
            OrderModel.findById(orderId, async (err, doc) => {
              if(err) {
                console.log(err)
              } else if(doc) {
                const diff = moment(doc.deliveryDate).startOf('day').diff(moment().startOf('day'), 'days')
                if(status === orderStatus.CANCELLED && diff <= 1) {
                  resolve({
                    actionInfo: {
                      hasError: true,
                      message: 'You can no longer cancel this order'
                    },
                    order: doc
                  })
                } else {
                  doc.status = status
                  doc.lastUpdatedBy = userId
                  resolve({
                    actionInfo: {
                      hasError: false,
                      message: `Order has been ${status === orderStatus.CANCELLED ? 'cancelled' : 'deleted'}`
                    },
                    order: await doc.save()
                  })
                }
                
              }
            })
          })
        } else if(user?.userType === userType.ADMIN) {
          return new Promise(resolve => {
            OrderModel.findById(orderId, async (err, doc) => {
              const userId = mongoose.Types.ObjectId(user.id)
              doc.status = status
              doc.lastUpdatedBy = userId
              doc.completedBy = status === orderStatus.COMPLETED ? userId : null
              resolve({
                actionInfo: {
                  hasError: false,
                  message: `Order has been updated`
                },
                order: await doc.save()
              })
            })
          })
        }
      }
    },

    createCollection: {
      type: ActionOnCollectionPayload,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(CollectionTypeEnum) },
        desc: { type: GraphQLString }
      },
      resolve: async (_, args) => {
        if(user?.userType === userType.ADMIN) {
          const userId = mongoose.Types.ObjectId(user.id)
          const newCollection = new CollectionModel({ ...args, lastUpdatedBy: userId })
          console.log(newCollection)

          return {
            actionInfo: {
              message: 'Collection has been created',
              hasError: false
            },
            collection: await newCollection.save()
          }
  /*
          const products = await ProductModel.find({})
          const productIds = products.map(item => item._id)
          await CollectionModel.updateMany({}, { productIds })*/
        }
      }
    },

    updateCollection: {
      type: ActionOnCollectionPayload,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(CollectionInput) }
      },
      resolve: async (_, { id, input }, { session: { user }}) => {
        if(user?.userType === userType.ADMIN) {
          const userId = mongoose.Types.ObjectId(user.id)
          return { 
            actionInfo: {
              message: 'Collection has been updated',
              hasError: false
            },
            collection: await CollectionModel.findByIdAndUpdate(
              mongoose.Types.ObjectId(id),
              { ...input, lastUpdatedBy: userId },
              { new: true }
            )
          }
        }
      }
    },

    addCollectionItems: {
      type: ActionOnCollectionPayload,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        itemIds: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) }
      },
      resolve: async (_, { id, itemIds }, { session: { user }}) => {
        if(user?.userType === userType.ADMIN) {
          const userId = mongoose.Types.ObjectId(user.id)
          return { 
            actionInfo: {
              message: 'Collection has been updated',
              hasError: false
            },
            collection: await CollectionModel.findByIdAndUpdate(
              mongoose.Types.ObjectId(id),
              {
                lastUpdatedBy: userId,
                $addToSet: {
                  itemIds: {
                    $each: itemIds
                  }
                }
              },
              { new: true }
            )
          }
        }
      }
    },

    deleteCollectionItems: {
      type: ActionOnCollectionPayload,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        itemIds: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) }
      },
      resolve: async (_, { id, itemIds }, { session: { user }}) => {
        if(user?.userType === userType.ADMIN) {
          const userId = mongoose.Types.ObjectId(user.id)
          return { 
            actionInfo: {
              message: 'Collection has been updated',
              hasError: false
            },
            collection: await CollectionModel.findByIdAndUpdate(
              mongoose.Types.ObjectId(id),
              {
                lastUpdatedBy: userId,
                $pull: {
                  itemIds: {
                    $in: itemIds
                  }
                }
              },
              { new: true }
            )
          }
        }
      }
    },

    addDeliveryAddress: {
      type: ActionOnDeliveryAddressPayload,
      args: {
        input: { type: new GraphQLNonNull(DeliveryAddressInput) }
      },
      resolve: async (_, { input }, { session: { user }}) => {
        if(user) {
          const userId = mongoose.Types.ObjectId(user.id)
          return new Promise((resolve) => {
            UserModel.findById(userId, async (error, doc) => {
              if(error) {
                console.log(error)
              } else {
                const _id = mongoose.Types.ObjectId()
                const deliveryAddress = {
                  _id,
                  default: !doc.deliveryAddresses.some(item => item.default === true),
                  ...input
                }

                doc.deliveryAddresses = [
                  ...doc.deliveryAddresses,
                  deliveryAddress
                ]

                await doc.save()
                resolve({
                  deliveryAddress: { 
                    ...deliveryAddress, 
                    // GraphQLID
                    id: _id.toString() 
                  }
                })
              }
            })
          })
        }
      }
    },
    updateDeliveryAddress: {
      type: ActionOnDeliveryAddressPayload,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(DeliveryAddressInput) }
      },
      resolve: async (_, { id, input }, { session: { user }}) => {
        if(user) {
          const userId = mongoose.Types.ObjectId(user.id)
          const updateOp = await UserModel.updateOne(
            {
              _id: userId,
              'deliveryAddresses._id': mongoose.Types.ObjectId(id)
            },
            {
              $set: {
                'deliveryAddresses.$.lat': input.lat,
                'deliveryAddresses.$.lng': input.lng,
                'deliveryAddresses.$.address': input.address
              }
            }
          )

          return {
            deliveryAddress: {
              id,
              ...input
            }
          }
        }
      }
    },
    updatePassword: {
      type: ActionInfo,
      args: {
        currentPassword: { type: new GraphQLNonNull(GraphQLString) },
        newPassword: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { currentPassword, newPassword }, { session: { user }}) => {
        if(user) {
          const userId = mongoose.Types.ObjectId(user.id)
          return new Promise((resolve, reject) => {
            UserModel.findById(userId, async (error, doc) => {
              if(error) {
                console.log(error)
              } else {
                const match = await bcrypt.compare(currentPassword, doc.password)
                if(!match) {
                  resolve({
                    hasError: true,
                    message: 'Your new password does not match your current password'
                  })
                } else {
                  doc.password = await hashPassword(newPassword)
                  const newDoc = await doc.save()
                  
                  if(newDoc) {
                    resolve({
                      hasError: false,
                      message: 'Your password has been updated'
                    })
                  }
                }
              }
            })
          })
        }
      }
    },
    updateProfile: {
      type: ActionOnUserPayload,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { name }, { session: { user }, req: { files }}) => {
        if(user) {
          const userId = mongoose.Types.ObjectId(user.id)

          return new Promise((resolve, reject) => {
            UserModel.findById(userId, async (error, doc) => {
              if(error) {
                console.log(error)
              } else {
                doc.name = name
                if(files?.length > 0)
                  doc.profilePhoto = await singleUpload(files[0])

                resolve({
                  actionInfo: {
                    hasError: false,
                    message: 'Your profile has been updated'
                  },
                  user: await doc.save()
                })
              }
            })
          })
        }
      }
    },
    updateUsername: {
      type: ActionOnUserPayload,
      args: {
        username: { type: new GraphQLNonNull(Username) }
      },
      resolve: async (_, { username }, { session: { user }}) => {
        if(user) {
          const userId = mongoose.Types.ObjectId(user.id)
          return new Promise((resolve, reject) => {
            UserModel.findById(userId, async (error, doc) => {
              if(error) {
                console.log(error)
              } else if(doc) {
                doc.loginIds = [
                  ...doc.loginIds.filter(id => !isValidUsername(id)),
                  username
                ]

                try {
                  resolve({
                    actionInfo: {
                      hasError: false,
                      message: 'Username has been updated'
                    },
                    user: await doc.save()
                  })
                } catch(error) {
                  if(error.code === 11000)
                  resolve({
                    actionInfo: {
                      hasError: true,
                      message: 'Username not available'
                    }
                  })
                }
                
              }
            })
          })
        }
      }
    },
    updateUserLastActive: {
      type: ActionOnUserPayload,
      resolve: async (_, __, { session: { user }}) => {
        if(user) {
          const userId = mongoose.Types.ObjectId(user.id)
          await UserModel.updateOne({ _id: userId }, { lastActive: new Date() })
          return {
            actionInfo: {
              hasError: false,
              message: ""
            }
          }
        }
      }
    },
    sendEmailVerificationCode: {
      type: SendEmailVerificationCodePayload,
      args: {
        email: { type: new GraphQLNonNull(GraphQLEmail) }
      },
      resolve: async (_, { email }, { session: { user }}) => {
        if(user) {
          const userId = mongoose.Types.ObjectId(user.id)
          const expires = new Date()
          expires.setMinutes(expires.getMinutes() + 3)
          
          const existingDoc = await UserModel.findOne(
            {
              loginIds: email,
              _id: {
                $ne: userId
              }
            },
            {
              "_id" : 1
            }
          )

          if(existingDoc) {
            return {
              actionInfo: {
                hasError: true,
                message: `${email} is not available`
              }
            }
          }

          const updateOp = await EmailVerificationModel.updateOne(
            { 
              _id: email 
            },
            {
              $set: {
                code: Math.floor(100000 + Math.random() * 900000), // 6 digit number
                expires
              }
            },
            {
              upsert: true
            }
          )

          if(updateOp.n === 1) {
            return {
              actionInfo: {
                hasError: false,
                message: `A verification code has been sent to ${email}`
              },
              emailVerification: {
                expires,
                email
              }
            }
          }
        }
      }
    },
    updateEmail: {
      type: ActionOnUserPayload,
      args: {
        email: { type: new GraphQLNonNull(GraphQLEmail) },
        verificationCode: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { email, verificationCode }, { session: { user }}) => {
        if(user) {
          const userId = mongoose.Types.ObjectId(user.id)
          const emailVerification = await EmailVerificationModel.findOne({
            _id: email
          })

          if(!emailVerification) {
            return {
              actionInfo: {
                hasError: true,
                message: 'Verification code not found'
              }
            }
          } else if(new Date().getTime() > emailVerification.expires.getTime()) {
            return {
              actionInfo: {
                hasError: true,
                message: 'Verification code has expired'
              }
            }
          } else if(emailVerification.code !== verificationCode) {
            return {
              actionInfo: {
                hasError: true,
                message: 'Invalid verification code'
              }
            }
          } else {
            return new Promise((resolve, reject) => {
              UserModel.findById(userId, async (error, doc) => {
                if(error) {
                  console.log(error)
                } else if(doc) {
                  doc.loginIds = [
                    ...doc.loginIds.filter(id => !isEmail(id)),
                    email
                  ]
  
                  try {
                    resolve({
                      actionInfo: {
                        hasError: false,
                        message: 'Email has been updated'
                      },
                      user: await doc.save()
                    })
                  } catch(error) {
                    if(error.code === 11000)
                    resolve({
                      actionInfo: {
                        hasError: true,
                        message: 'Email not available'
                      }
                    })
                  }
                  
                }
              })
            })
          }
        }
      }
    },
    addPaymentMethod: {
      type: GraphQLBoolean,
      args: {
        input: { type: new GraphQLNonNull(PaymentMethodInput) }
      },
      resolve: async (_, { input }) => {
        await AppConfigModel.findById('buku_masak', async (error, doc) => {
          if(error) {
            console.log(error)
          } else {
            if(doc.paymentMethods.length === 0) {
              doc.paymentMethods.push({ ...input, default: true })
              await doc.save()
            }
          }
        })
      }
    },
    placeOrder: {
      type: PlaceOrderPayload,
      args: {
        input: { type: new GraphQLNonNull(PlaceOrderInput) }
      },
      resolve: async (_, { input }, { session }) => {
        const { user, cartId } = session
        if(!user)
          throw new Error('Not authorized')

      /*  if(!cartId) {
          return {
            actionInfo: {
              hasError: true,
              message: 'Your cart is empty'
            }
          }
        }*/
        const deliveryDaysThreshold = moment(input.deliveryDate).startOf('day').diff(moment().startOf('day'), 'days')
        
        const userId = mongoose.Types.ObjectId(user.id)
        const me = await UserModel.findById(userId)

        const address = me.deliveryAddresses.find(item => item._id.equals(input.deliveryAddressId))

        const appConfigPromise = AppConfigLoader.load('buku_masak')
        const serviceAvailabilityPromise = ServiceAvailabilityLoader.load(`${address.lat},${address.lng}`)

        const cartPromise = CartModel.findOne({ cartId: mongoose.Types.ObjectId(cartId) })
        
        const data = await Promise.all([
          serviceAvailabilityPromise,
          cartPromise,
          appConfigPromise
        ])

        const [serviceAvailability, cart, appConfig] = data

        if(deliveryDaysThreshold < appConfig.deliveryDaysThreshold) {
          throw new Error('Date does not meet delivery days threshold')
        }

        const paymentMethod = appConfig.paymentMethods.find(item => item._id.equals(input.paymentMethodId))

        if(!paymentMethod) {
          throw new Error('Payment method not found')
        } else if(!serviceAvailability?.service_available) {
          return {
            actionInfo: {
              hasError: true,
              message: `Our service is still not available in this delivery area` + (serviceAvailability ? ` (${serviceAvailability.area})` : '')
            },
            cart
          }
        } else if(!cart?.items?.length) {
          return {
            actionInfo: {
              hasError: true,
              message: 'Your cart is empty'
            },
            cart
          }
        } else {
          const productIds = cart.items.map(item => item.productId)
          const products = await Promise.all(productIds.map(id =>
            ProductLoader.load(id)
          ))

          // only products that are in stock
          const productsInStock = products.filter(item => item.inStock)
          // if all the products are suddenly out of stock
          // let say because the place order button is clicked just right after our admins update the product availability
          if(productsInStock.length < products.length) {
            return {
              actionInfo: {
                hasError: true,
                message: `Order not placed because ${productsInStock.length === 0 ? 'all' : 'some of'} the products are out of stock`
              },
              cart
            }
          }

          const items = await products.reduce(async(total, product) => {
            const orderQty = cart.items.find(item => item.productId.equals(product._id)).qty
            const discountedOrderQty = 0
            
            // check/handle discount
            let subtotal = product.pricePerUnitQty * orderQty
            let discount = null
            if(
              product.discount && 
              isTodayBetween(product.discount.startDate, product.discount.endDate) &&
              orderQty >= product.discount.orderQtyThreshold
            ) {
              subtotal = product.discount.pricePerUnitQty * orderQty
              discount = {
                pricePerUnitQty: product.discount.pricePerUnitQty,
                orderQtyThreshold: product.discount.orderQtyThreshold
              }
            }

            const orderedProduct = {
              _id: product._id,
              name: product.name,
              image: product.images.find((image, i) => (image.display === 1 || i === 0)),
              pricePerUnitQty: product.pricePerUnitQty,
              unitQty: product.unitQty,
              unit: (await UnitLoader.load(product.unitId)).display,
              discount
            }

            const array = await total
            array.push({
              orderQty,
              discountedOrderQty,
              subtotal,
              product: orderedProduct
            })

            return array
          }, Promise.resolve([]))

          const deliveryFee = 0

          const order = new OrderModel({
            userId,
            lastUpdatedBy: userId,
            status: orderStatus.PROCESSING,
            deliveryDate: input.deliveryDate,
            deliveryAddress: address,
            deliveryFee,
            packagingPrice: appConfig.packagingPrice,
            totalPrice: (items.reduce((total, item) => {
              return total + item.subtotal
            }, 0) + deliveryFee + appConfig.packagingPrice),
            paymentMethod,
            items
          })

          const savedOrder = await order.save()
          await CartModel.deleteOne({ cartId: mongoose.Types.ObjectId(cartId) })
          delete session.cartId
          if(savedOrder) {
            return {
              actionInfo: {
                hasError: false,
                message: 'Thank you for your order. It will be processed soon.'
              },
              cart: null,
              order: savedOrder
            }
          }
        }
      }
    },
    markReadUnreadNotifications: {
      type: GraphQLBoolean,
      resolve: async (_, __, { session: { user }}) => {
        if(user) {
          const userId = mongoose.Types.ObjectId(user.id)
          await NotificationModel.updateMany(
            {
              to: userId,
              readBy: { "$ne": userId }
            },
            {
              "$addToSet": { readBy: userId }
            }
          )
          return true
        }
      }
    },
    createRecipe: {
      type: ActionOnRecipePayload,
      args: {
        input: { type: new GraphQLNonNull(RecipeInput) }
      },
      resolve: async (_, { input }, ctx) => {
        const { session: { user }} = ctx
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) {
          const userId = mongoose.Types.ObjectId(user.id)
          const { req } = ctx
          const { files } = req

          const images = await bulkUpload(files)
          const newRecipe = new RecipeModel({
            lastUpdatedBy: userId,
            ...input,
            images: images.map((image, i) => ({
              ...image,
              display: i === 0 ? 1 : 0
            }))
          })
          const saveResult = await newRecipe.save()
    
          return {
            actionInfo: {
              hasError: false,
              message: 'Recipe has been created.'
            },
            recipe: saveResult
          }
        }
      }
    },
    updateRecipe: {
      type: ActionOnRecipePayload,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(RecipeInput) }
      },
      resolve: async (_, { input, id }, ctx) => {
        const { session: { user }} = ctx
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) {
          const userId = mongoose.Types.ObjectId(user.id)
          const { req } = ctx
          const { files } = req

          const images = files?.length > 0 ? await bulkUpload(files) : undefined
          const saveResult = await RecipeModel.findByIdAndUpdate(
            mongoose.Types.ObjectId(id),
            {
              ...input,
              ...(images ? { images } : {}),
              lastUpdatedBy: userId
            },
            { new: true }
          )
    
          return {
            actionInfo: {
              hasError: false,
              message: 'Recipe has been updated.'
            },
            recipe: saveResult
          }
        }
      }
    },
    addCookingStep: {
      type: ActionOnRecipePayload,
      args: {
        recipeId: { type: new GraphQLNonNull(GraphQLString) },
        desc: { type: new GraphQLNonNull(GraphQLString) },
        videoUrl: { type: GraphQLString },
        position: { type: GraphQLInt }
      },
      resolve: async (_, { recipeId, desc, videoUrl, position }, ctx) => {
        const { session: { user }} = ctx
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) {
          const userId = mongoose.Types.ObjectId(user.id)
          const { req } = ctx
          const { files } = req

          const images = files?.length > 0 ? await bulkUpload(files) : []
          const step = {
            desc,
            videoUrl,
            images
          }

          const saveResult = await RecipeModel.findByIdAndUpdate(
            mongoose.Types.ObjectId(recipeId),
            {
              lastUpdatedBy: userId,
              $push: {
                steps: {
                  $each: [step],
                  $position: position
                }
              }
            },
            { new: true }
          )
    
          return {
            actionInfo: {
              hasError: false,
              message: 'Step has been added.'
            },
            recipe: saveResult
          }
        }
      }
    },
    deleteCookingStep: {
      type: ActionOnRecipePayload,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { id }, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) {
          const userId = mongoose.Types.ObjectId(user.id)
          const stepId = mongoose.Types.ObjectId(id)
          const saveResult = await RecipeModel.findOneAndUpdate(
            {
              'steps._id': stepId,
            },
            {
              lastUpdatedBy: userId,
              $pull: {
                steps: {
                  _id: stepId
                }
              }
            },
            { new: true }
          )
    
          return {
            actionInfo: {
              hasError: false,
              message: 'Step has been deleted.'
            },
            recipe: saveResult
          }
        } 
      }
    },
    createBanner: {
      type: ActionOnAppConfigPayload,
      args: {
        input: { type: new GraphQLNonNull(BannerInput) },
        position: { type: GraphQLInt }
      },
      resolve: async (_, { input, position }, { session: { user }, req: { files }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) {
          const userId = mongoose.Types.ObjectId(user.id)

          const image = await singleUpload(files[0])
          const banner = {
            lastUpdatedBy: userId,
            image,
            ...input
          }

          const saveResult = await AppConfigModel.findByIdAndUpdate(
            'buku_masak',
            {
              lastUpdatedBy: userId,
              $push: {
                banners: {
                  $each: [banner],
                  $position: position
                }
              }
            },
            { new: true }
          )
    
          return {
            actionInfo: {
              hasError: false,
              message: 'Banner has been created.'
            },
            appConfig: saveResult
          }
        } 
      }
    },
    updateBanner: {
      type: ActionOnAppConfigPayload,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(BannerInput) }
      },
      resolve: async (_) => {
        
      }
    },
    createLink: {
      type: ActionOnAppConfigPayload,
      args: {
        input: { type: new GraphQLNonNull(LinkInput) },
        position: { type: GraphQLInt }
      },
      resolve: async (_, { input, position }, { session: { user }, req: { files }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) {
          const userId = mongoose.Types.ObjectId(user.id)

          const icon = await singleUpload(files[0])
          const link = {
            lastUpdatedBy: userId,
            icon,
            ...input
          }

          const saveResult = await AppConfigModel.findByIdAndUpdate(
            'buku_masak',
            {
              lastUpdatedBy: userId,
              $push: {
                links: {
                  $each: [link],
                  $position: position
                }
              }
            },
            { new: true }
          )
    
          return {
            actionInfo: {
              hasError: false,
              message: 'Link has been created.'
            },
            appConfig: saveResult
          }
        } 
      }
    },
  },
})