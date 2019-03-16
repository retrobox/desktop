
const platform = require('os').platform;

const scanner = require('etcher-scanner');

async function main() {
  const adapters = [
    new scanner.adapters.BlockDeviceAdapter(() => true),
    new scanner.adapters.UsbbootDeviceAdapter(),
  ];
  if (platform() === 'win32') {
    if (scanner.adapters.DriverlessDeviceAdapter !== undefined) {
      adapters.push(new scanner.adapters.DriverlessDeviceAdapter());
    }
  }
  const deviceScanner = new scanner.Scanner(adapters);

  // listen for attach event (when a device is plugged)
  deviceScanner.on(
    'attach',
    async (drive) => {
      // drive is an object of type BlockDevice
      console.log('attach', drive);
      if (drive.emitsProgress) {
        drive.on('progress', (progress) => {
          console.log(drive, progress, '%');
        });
      }
    },
  );
  // listen for detach event (when a device is unplugged)
  deviceScanner.on(
    'detach',
    (drive) => {
      // drive is an object of type BlockDevice
      console.log('detach', drive);
    },
  );
  deviceScanner.on('error', (error) => {
    console.log('error', error);
  });

  // start the scanner (event listener)
  await deviceScanner.start();

}

main();
