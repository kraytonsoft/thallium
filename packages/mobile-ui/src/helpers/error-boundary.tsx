import React, { Component, PropsWithChildren } from 'react';
import { View, Text, Button } from 'react-native';

type State = { crashed: boolean; remountKey: number };
type Props = PropsWithChildren<{
  onError?: (error: unknown, info: React.ErrorInfo) => void; // <-- exposed
}>;

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { crashed: false, remountKey: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { crashed: true };
  }

  override componentDidCatch(error: unknown, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  private reset = () =>
    this.setState((s) => ({ crashed: false, remountKey: s.remountKey + 1 }));

  override render() {
    if (this.state.crashed) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <Text style={{ marginBottom: 16 }}>Something went wrong.</Text>
          <Button title="Try again" onPress={this.reset} />
        </View>
      );
    }
    return (
      <View key={this.state.remountKey} style={{ flex: 1 }}>
        {this.props.children}
      </View>
    );
  }
}
