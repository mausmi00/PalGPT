import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
    const body = await request.json();
    const {
        email,
        name,
        password,
    } = body;

    if(!email || !name || !password) {
        return new NextResponse('Missing info', {status: 400});
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
        }
    });

    return NextResponse.json(user); // since we are using json here we don't need to specify new
}catch(errors: any) {
    console.log(errors, 'REGISTRATION_ERROR');
    return new NextResponse('Internal Error', {status: 500}); 
}
} 