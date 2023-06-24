import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: {
        signIn: "/"
    }
});

export const config = { /* the users page or any other page of the format /users/* requires authentication */
    matcher: [
        "/users/:path*",
        "/friends/:path*",
        "/agents/:path*",
        // "/conversations/:path*"
    ]
};