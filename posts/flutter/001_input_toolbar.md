# Implementing an Input Toolbar in Flutter

This post is about implementing an input toolbar to add images to a post, just like how it works in Twitter, Whatsapp, or other apps. I'm writing this quick post for one of my teammates at Upcarta. I will be brief and won't go into many details.

Here is our view. We wrap the view itself and the input toolbar with a `Column`.

```dart
return Scaffold(
      appBar: AppBar(
        title: Text('Ticket #${ticket.ticketId}'),
        actions: [
          _CloseTicketButton(ticket),
        ],
      ),
      body: Column(
        children: <Widget>[
          _View(ticket: ticket).expand(),
          // The input toolbar and button
          _TextingKeyboard(ticket: ticket),
        ],
      ),
    );
```


Here is what the input toolbar looks like. I've omitted a lot of it for the sake of simplicity. You should adjust the paddings, etc. for yourself. One difficulty I had was adjusting the paddings and the sizes of the input toolbar widgets. One good option could be turning this whole view into a reusable compontent.

Note that I use my own widget extensions instead of `Padding`, `Flexible` and `Expanded` widgets. I think they keep the widget tree cleaner. But they are nothing special.
```dart
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      minimum: const EdgeInsets.only(
        bottom: kVerticalPaddingSmall,
        left: kHorizontalPaddingSmall,
        right: kHorizontalPaddingSmall,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: <Widget>[
          ConstrainedBox(
            constraints: const BoxConstraints(
              minHeight: 36,
            ),
            child: TextField(...),
          ).flex(),
          const SizedBox(width: 4),
          // Button
          SizedBox.square(
            dimension: 36,
            child: IconButton.filled(
              padding: const EdgeInsets.all(kVerticalPaddingSmall),
              onPressed: () {...},
              icon: const Icon(
                Icons.send,
                size: 20,
                color: AppColors.white,
              ),
            ),
          ),
        ],
      ).padding(top: kVerticalPaddingSmall),
    ).backgroundColor(AppColors.red[3]!);
  }
```

We are not done yet. The `_View`, which is the widget that actually shows the view itself should be wrapped into a `SingleChildScrollView` or some other scrollable. This is necessary because we want to have the keyboard take up space in the screen, limiting the size of the view, and turning it into a scrollable widget where it sits. Here is what I went with:

```dart
return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 56),
      keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
      child: Column(
```