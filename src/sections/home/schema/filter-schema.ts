import { z } from "zod";
import dayjs from "dayjs";

export const TourFilterSchema = z
    .object({
        title: z.string().trim().max(100, "Tên tour quá dài").optional(),

        includes: z.array(z.string()).optional(),
        extras: z.array(z.string()).optional(),
        locations: z.array(z.string()).optional(),
        fromDate: z.string().nullable().optional(),
        toDate: z.string().nullable().optional(),

        priceRange: z
            .tuple([z.number(), z.number()])
            .refine(([min, max]) => min <= max, {
                message: "Khoảng giá không hợp lệ",
            }),
    })
    .refine(
        (data) => {
            if (data.fromDate && data.toDate) {
                const from = dayjs(data.fromDate);
                const to = dayjs(data.toDate);
                return from.isBefore(to) || from.isSame(to, "day");
            }
            return true;
        },
        {
            message: "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
            path: ["toDate"],
        }
    );
