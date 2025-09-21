import React, { FC } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useBottomSheetRef,
  useModal,
  useConstantSnapPoint,
} from '@thallium/mobile-ui/helpers';
import {
  makeBox,
  makeButton,
  makeCheckbox,
  makeIcon,
  makePill,
  makeSeparator,
  makeSpinner,
  makeSwitch,
  makeTextInput,
  makeTypography,
} from '@thallium/mobile-ui/primitives';
import type { AppTheme } from '../theme';
import {
  makeBottomSheet,
  makeCard,
  makeGenericList,
  makeGenericModal,
} from '@thallium/mobile-ui/composites';
import {
  makeControlledDatePicker,
  makeControlledInput,
  makeControlledSelect,
} from '@thallium/mobile-ui/form';
import { z } from 'zod';
import { capitalize } from 'lodash';

const Typography = makeTypography<AppTheme>();
const Button = makeButton<AppTheme>();
const DBox = makeBox<AppTheme>();
const Icon = makeIcon<AppTheme>();
const Switch = makeSwitch<AppTheme>();
const TextInput = makeTextInput<AppTheme>();
const Checkbox = makeCheckbox<AppTheme>();
const Separator = makeSeparator<AppTheme>();
const Pill = makePill<AppTheme>();
const Card = makeCard<AppTheme>();
const GenericModal = makeGenericModal<AppTheme>();
const ControlledSelect = makeControlledSelect<AppTheme>();

// eslint-disable-next-line
const GenericList = makeGenericList<AppTheme>();
const Spinner = makeSpinner<AppTheme>();
const BottomSheet = makeBottomSheet<AppTheme>();
const ControlledInput = makeControlledInput<AppTheme>();
const ControlledDatePicker = makeControlledDatePicker<AppTheme>();

export enum TestType {
  one = 'one',
  two = 'two',
  three = 'three',
}
const testSchema = z.object({
  type: z.enum(TestType),
  email: z.email(),
  dob: z.string(),
});
type TestDto = z.infer<typeof testSchema>;

const RootStack: FC = () => {
  const [on, setOn] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const { ref, open: openSheet } = useBottomSheetRef();
  const { open, close, visible } = useModal();
  const snapPoint = useConstantSnapPoint(500);
  const { control } = useForm<TestDto>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      type: TestType.two,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DBox flex={1}>
        <ScrollView>
          <DBox
            paddingVertical="lg"
            flex={1}
            backgroundColor="background"
            alignItems="center"
            justifyContent="center"
            gap="md"
          >
            <Button onPress={openSheet}>Open Sheet</Button>
            <BottomSheet
              ref={ref}
              snapPoints={['30%', snapPoint]}
              backgroundColorToken="popover"
              indicatorColorToken="popoverForeground"
              backdropColorToken="black"
              backdropOpacity={0.6}
              renderHeader={(dismiss) => (
                <TouchableOpacity onPress={dismiss}>
                  <Icon name="x" />
                </TouchableOpacity>
              )}
            >
              <Typography variant="title">Hello</Typography>
            </BottomSheet>
            <Button onPress={open}>Open modal</Button>
            <GenericModal
              visible={visible}
              onClose={open}
              backdropOpacity={0.6}
              backdropColorToken="black"
              cardRadiusKey="button"
              cardPaddingKey="lg"
            >
              <Spinner />
              <Typography variant="title">Hello!</Typography>
              <Typography>Modal content goes here.</Typography>
              <Button
                variant="secondary"
                onPress={close}
                style={{ marginTop: 12 }}
              >
                Close
              </Button>
            </GenericModal>
            <Typography variant="title">buttons + sizes {'✅'}</Typography>
            <Button left={<Typography>{'➕'}</Typography>}>Primary</Button>
            <Button variant="secondary" size="sm">
              Secondary sm
            </Button>
            <Button
              variant="outlined"
              size="lg"
              right={<Typography>›</Typography>}
            >
              Outlined lg
            </Button>
            <Button
              variant="destructive"
              isLoading
              left={<Icon type="MaterialIcons" name="delete-outline" />}
            >
              Deleting…
            </Button>
            <Separator marginTop="md" />
            <Separator direction="vertical" thickness={2} length={48} />
            <Separator colorToken="brand" />
            <Separator colorToken="#333" />
            <Button disabled fullWidth>
              Disabled full width
            </Button>
            <Switch checked={on} onChange={setOn} />
            <Switch size="lg" checked={!on} onChange={(v) => setOn(!v)} />
            <Switch disabled checked />
            <TextInput
              placeholder="Your name"
              value={value}
              onChangeText={setValue}
            />
            <TextInput size="lg" placeholder="Large input" />
            <TextInput editable={false} value="Disabled" />
            <TextInput placeholder="Per-variant width" />
            <TextInput placeholder="Override to 3px" />
            <TextInput placeholder="Restyle wins" />

            <Checkbox checked={checked} onChange={setChecked} />
            <Checkbox size="md" checked />
            <Checkbox checked={false} size="lg" />

            <Pill text="All" isActive />
            <Pill text="Design" />
            <Pill text="Outlined" variant="outline" />
            <Pill text="Small" size="sm" />
            <Pill text="Disabled" isDisabled />
            <Pill text="Thicc border" borderWidthOverride={2} />

            <Card>
              <Typography>Plain card</Typography>
            </Card>

            <Card loading padding="lg" width="100%">
              <Typography>Will show when loaded</Typography>
            </Card>

            <Card
              bgToken="background"
              borderColor="brand"
              borderWidthOverride={2}
            >
              <Typography>Custom frame</Typography>
            </Card>

            <Card variant="elevated">
              <Typography>Custom frame</Typography>
            </Card>

            <Card variant="outline">
              <Typography>Custom frame</Typography>
            </Card>

            <Card variant="tinted">
              <Typography>Custom frame</Typography>
            </Card>

            <Card radiusKey="button" paddingKey="md">
              <Typography>Custom radius + padding</Typography>
            </Card>
            <ControlledSelect
              control={control}
              name="type"
              options={Object.values(TestType).map((v) => ({
                label: capitalize(v),
                value: v,
              }))}
              placeholder="Choose…"
              sheetProps={{
                renderHeader: (dismiss) => (
                  <TouchableOpacity onPress={dismiss}>
                    <Icon name="x" />
                  </TouchableOpacity>
                ),
                snapPoints: ['50%'],
              }}
            />
            <ControlledInput
              control={control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              rightIcon={
                <Icon type="Feather" name="mail" size={16} colorToken="muted" />
              }
            />
            <ControlledDatePicker
              sheetProps={{
                renderHeader: (dismiss) => (
                  <TouchableOpacity onPress={dismiss}>
                    <Icon name="x" />
                  </TouchableOpacity>
                ),
              }}
              control={control}
              name={'dob'}
            />
          </DBox>
        </ScrollView>
      </DBox>
    </SafeAreaView>
  );
};
export default RootStack;
