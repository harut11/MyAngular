Hi {{ $user->name }} for reseting your password go to
<a href="{{ url('set-password') . '/'. $token }}" >here</a>

Or just copy the link <a href="{{ url('set-password') . '/'. $token }}">{{ url('set-password/') . '/'. $token }}</a>