<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\RegisterRequest;
use App\Mail\VerificationEmail;
use App\Mail\ResetMail;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{

    /**
     * AuthController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'reset', 'setPassword']]);
    }

    /**
     * @param RegisterRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(RegisterRequest $request)
    {
    	$token = base64_encode(str_random(140));
    	$user = User::query()->create([
    		'name' => $request->name,
    		'email' => $request->email,
    		'password' => bcrypt($request->password),
    		'verification_token' => $token
    	]);

    	Mail::to($user)->queue(new VerificationEmail($user));

    	return response()->json(['message' => 'success'], 201);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function verify(Request $request)
    {
    	$this->validate($request, [
    		'token' => 'required|exists:users,verification_token'
    	]);

    	User::query()->whereVerificationToken($request->token)
    		->update([
    			'verification_token' => null,
    			'email_verified_at' => Carbon::now()
    		]);

    	return response()->json(['success' => true], 204);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login() {
    	$credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function reset(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email|max:60|string|exists:users,email'
        ]);

        $token = str_random(100);
        $email = $request->input('email');

        DB::table('password_resets')->updateOrInsert([
            'email' => $email,
        ], [
            'email' => $email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);

        $user = User::query()
            ->whereEmail($email)
            ->first();

        Mail::to($email)->queue(new ResetMail($user, $token));

        return response()->json(['message' => 'success'], 201);
    }

    /**
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function setPassword(Request $request)
    {
        $this->validate($request, [
            'token' => 'required|string|exists:password_resets,token',
            'password' => 'required|string|confirmed|min:6'
        ]);

        $info = DB::table('password_resets')
            ->where('token', '=', $request->input('token'));

        $infoFirst = $info->first();

        User::query()
            ->whereEmail($infoFirst->email)
            ->update(['password' => bcrypt($request->password)]);
            
        $info->delete();

        return response()->json(['message' => 'success'], 201);
    }
}