Hi {{ $user->name }}, please verify your account
<a href="{{ url('verify') . '/' . $user->verification_token }}">here</a>

Or just copy the link <a href="{{ url('verify') . '/' . $user->verification_token }}">{{ url('verify') . '/' . $user->verification_token }}</a>