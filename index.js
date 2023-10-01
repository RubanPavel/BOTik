const {Telegraf, Markup} = require('telegraf')
const {message} = require('telegraf/filters')
require('dotenv').config()
const my_const = require('./const')

const buttons = [
    [
        Markup.button.callback('Мужской зал', 'button1'),
        Markup.button.callback('Женский зал', 'button2')
    ],
    [
        Markup.button.callback('Маникюр', 'button3'),
        Markup.button.callback('Педикюр', 'button4')
    ]
];


const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'}!`))

bot.help((ctx) => ctx.reply(my_const.commands))


bot.command('services', async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Здарова, заебал</b>', Markup.inlineKeyboard(buttons))

    } catch (e) {
        console.error(e)
    }
})

bot.action('back', (ctx) => {
    ctx.deleteMessage(); // Удаляем сообщение с кнопками
    ctx.reply('Главное меню', {
        reply_markup: {
            inline_keyboard: buttons
        }
    });
});


function botFunction(nameBtn, src, text) {
    bot.action(nameBtn, async (ctx) => {
        try {
            await ctx.answerCbQuery()
            if (src !== false) {
                await ctx.replyWithPhoto({
                    source: src
                })
            }
            await ctx.replyWithHTML(text, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            Markup.button.callback('Назад в прайс', 'back')
                        ]
                    ]
                }
            })
        } catch (e) {
            console.error(e)
        }
    })
}

botFunction('button1', './img/strig.jpg', my_const.text1)
botFunction('button2', './img/mak.jpg', my_const.text1)
botFunction('button3', './img/mani.jpg', my_const.text1)
botFunction('button4', './img/pedi.jpg', my_const.text1)


/*bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))*/
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))