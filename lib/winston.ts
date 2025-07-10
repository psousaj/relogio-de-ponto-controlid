import winston from "winston"

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.splat(),
                winston.format.printf((info: any) => {
                    if (info.stack) {
                        return `${info.timestamp} ${info.level} ${info.stack}`
                    }
                    return `${info.timestamp} ${info.level} ${String(info.message).trim()}`
                })
            ),
            level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info'
        }),
    ]
})