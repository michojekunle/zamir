import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:math' as math;

/// Typewriter text animation that reveals text character by character
class TypewriterText extends StatefulWidget {
  final String text;
  final TextStyle? style;
  final Duration charDuration;
  final VoidCallback? onComplete;
  final bool autoStart;

  const TypewriterText({
    super.key,
    required this.text,
    this.style,
    this.charDuration = const Duration(milliseconds: 50),
    this.onComplete,
    this.autoStart = true,
  });

  @override
  State<TypewriterText> createState() => _TypewriterTextState();
}

class _TypewriterTextState extends State<TypewriterText> {
  String _displayText = '';
  Timer? _timer;
  int _charIndex = 0;

  @override
  void initState() {
    super.initState();
    if (widget.autoStart) {
      _startTyping();
    }
  }

  @override
  void didUpdateWidget(TypewriterText oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.text != widget.text) {
      _reset();
      if (widget.autoStart) {
        _startTyping();
      }
    }
  }

  void _reset() {
    _timer?.cancel();
    _charIndex = 0;
    _displayText = '';
  }

  void _startTyping() {
    _timer = Timer.periodic(widget.charDuration, (timer) {
      if (_charIndex < widget.text.length) {
        setState(() {
          _displayText = widget.text.substring(0, _charIndex + 1);
          _charIndex++;
        });
      } else {
        timer.cancel();
        widget.onComplete?.call();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Text(_displayText, style: widget.style);
  }
}

/// Lyric line with highlight animation
class AnimatedLyricLine extends StatelessWidget {
  final String text;
  final bool isActive;
  final bool isPast;
  final TextStyle? activeStyle;
  final TextStyle? inactiveStyle;

  const AnimatedLyricLine({
    super.key,
    required this.text,
    this.isActive = false,
    this.isPast = false,
    this.activeStyle,
    this.inactiveStyle,
  });

  @override
  Widget build(BuildContext context) {
    final defaultActiveStyle = TextStyle(
      fontSize: 18,
      fontWeight: FontWeight.w600,
      color: Theme.of(context).colorScheme.primary,
    );

    final defaultInactiveStyle = TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w400,
      color: isPast
          ? Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5)
          : Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
    );

    return AnimatedDefaultTextStyle(
      duration: const Duration(milliseconds: 300),
      style: isActive
          ? (activeStyle ?? defaultActiveStyle)
          : (inactiveStyle ?? defaultInactiveStyle),
      child: AnimatedScale(
        scale: isActive ? 1.05 : 1.0,
        duration: const Duration(milliseconds: 300),
        child: Text(text, textAlign: TextAlign.center),
      ),
    );
  }
}

/// Animated audio waveform visualization
class AnimatedWaveform extends StatefulWidget {
  final Color color;
  final int barCount;
  final double height;
  final bool isAnimating;

  const AnimatedWaveform({
    super.key,
    this.color = Colors.blue,
    this.barCount = 30,
    this.height = 60,
    this.isAnimating = true,
  });

  @override
  State<AnimatedWaveform> createState() => _AnimatedWaveformState();
}

class _AnimatedWaveformState extends State<AnimatedWaveform>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
    if (widget.isAnimating) {
      _controller.repeat();
    }
  }

  @override
  void didUpdateWidget(AnimatedWaveform oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isAnimating && !_controller.isAnimating) {
      _controller.repeat();
    } else if (!widget.isAnimating && _controller.isAnimating) {
      _controller.stop();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return SizedBox(
          height: widget.height,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: List.generate(widget.barCount, (index) {
              final phase = (index / widget.barCount) * 2 * math.pi;
              final amplitude = widget.isAnimating
                  ? (math.sin(_controller.value * 2 * math.pi + phase) + 1) / 2
                  : 0.3;

              return Container(
                width: 3,
                height: widget.height * (0.2 + amplitude * 0.8),
                decoration: BoxDecoration(
                  color: widget.color.withOpacity(0.6 + amplitude * 0.4),
                  borderRadius: BorderRadius.circular(2),
                ),
              );
            }),
          ),
        );
      },
    );
  }
}

/// Shimmer loading effect
class ShimmerLoading extends StatefulWidget {
  final Widget child;
  final bool isLoading;

  const ShimmerLoading({super.key, required this.child, this.isLoading = true});

  @override
  State<ShimmerLoading> createState() => _ShimmerLoadingState();
}

class _ShimmerLoadingState extends State<ShimmerLoading>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.isLoading) return widget.child;

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return ShaderMask(
          shaderCallback: (bounds) {
            return LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: const [Colors.grey, Colors.white, Colors.grey],
              stops: [
                _controller.value - 0.3,
                _controller.value,
                _controller.value + 0.3,
              ].map((stop) => stop.clamp(0.0, 1.0)).toList(),
            ).createShader(bounds);
          },
          child: widget.child,
        );
      },
    );
  }
}

/// Fade slide transition for page navigation
class FadeSlideTransition extends StatelessWidget {
  final Animation<double> animation;
  final Widget child;

  const FadeSlideTransition({
    super.key,
    required this.animation,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: animation,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0.0, 0.1),
          end: Offset.zero,
        ).animate(CurvedAnimation(parent: animation, curve: Curves.easeOut)),
        child: child,
      ),
    );
  }
}

/// Page route with fade slide animation
class FadeSlideRoute<T> extends PageRouteBuilder<T> {
  final Widget page;

  FadeSlideRoute({required this.page})
    : super(
        pageBuilder: (context, animation, secondaryAnimation) => page,
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeSlideTransition(animation: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 300),
      );
}

/// Pulse animation for generating state
class PulseAnimation extends StatefulWidget {
  final Widget child;
  final bool isAnimating;

  const PulseAnimation({
    super.key,
    required this.child,
    this.isAnimating = true,
  });

  @override
  State<PulseAnimation> createState() => _PulseAnimationState();
}

class _PulseAnimationState extends State<PulseAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    if (widget.isAnimating) {
      _controller.repeat(reverse: true);
    }
  }

  @override
  void didUpdateWidget(PulseAnimation oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isAnimating && !_controller.isAnimating) {
      _controller.repeat(reverse: true);
    } else if (!widget.isAnimating && _controller.isAnimating) {
      _controller.stop();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.scale(
          scale: 1.0 + (_controller.value * 0.1),
          child: Opacity(
            opacity: 0.7 + (_controller.value * 0.3),
            child: widget.child,
          ),
        );
      },
    );
  }
}
